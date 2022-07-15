import React from "react";
import { useContextProvider } from "../../utils/context";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import MessageNotifications from "./messageNotifications";

const MessagesHeader = (props) => {
  const { conversations, notifications, isMobile } = props;

  const {
    setActiveComponent,
    selectedConversation,
    setShowSettings,
  } = useContextProvider();

  var name;

  if (selectedConversation.conversationId) {
    const conversation = conversations.find(
      (conversation) => conversation._id === selectedConversation.conversationId
    );

    if (conversation.name) {
      name = conversation.name;
    } else {
      if (conversation.recipients.length === 1) {
        name = conversation.recipients[0].username;
      } else if (conversation.recipients.length > 1) {
        name = conversation.recipients
          .map((recipient) => {
            return recipient.username;
          })
          .join(", ");
      } else {
        name = "All users left";
      }
    }
  } else {
    name = selectedConversation.recipients
      .map((recipient) => recipient.username)
      .join(", ");
  }

  const handleSettings = (e) => {
    e.preventDefault();
    setActiveComponent("settings");
    setShowSettings(true);
  };

  return (
    <div id="messages-header">
      <div id="messages-header-title">
        {isMobile && (
          <div id="messages-header-back">
            <FontAwesomeIcon
              icon={faChevronLeft}
              onClick={() => {
                setActiveComponent("conversations");
              }}
            />
          </div>
        )}
        <h3>{name}</h3>
      </div>

      <div id="messages-header-buttons">
        <MessageNotifications notifications={notifications} />

        <button id="settings-button" onClick={handleSettings}>
          <FontAwesomeIcon icon={faCog} />
        </button>
      </div>
    </div>
  );
};

export default MessagesHeader;
