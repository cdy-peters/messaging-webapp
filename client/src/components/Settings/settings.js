import React from "react";
import { useContextProvider } from "../../utils/context";

import SettingsHeader from "./settingsHeader";
import SettingsName from "./settingsName";
import SettingsUsers from "./settingsUsers";
import SettingsLeave from "./settingsLeave";

const Settings = (props) => {
  const { conversations, setConversations, socket } = props;

  const { selectedConversation } = useContextProvider();

  return (
    <div id="settings">
      <SettingsHeader />
      <div id="settings-content-outer">
        <div id="settings-content-inner">
          <SettingsName
            conversations={conversations}
            setConversations={setConversations}
            socket={socket}
          />
          <br></br>

          <SettingsUsers
            conversations={conversations}
            setConversations={setConversations}
            socket={socket}
          />

          {selectedConversation.conversationId && (
            <SettingsLeave
              conversations={conversations}
              setConversations={setConversations}
              socket={socket}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
