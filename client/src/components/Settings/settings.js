import React from "react";

import SettingsHeader from "./settingsHeader";
import SettingsName from "./settingsName";
import SettingsUsers from "./settingsUsers";
import SettingsLeave from "./settingsLeave";

const Settings = (props) => {
  const {
    setShowSettings,
    selectedConversation,
    conversations,
    setConversations,
    setSelectedConversation,
    socket,
  } = props;

  return (
    <div id="settings">
      <SettingsHeader setShowSettings={setShowSettings} />
      <div id="settings-content-outer">
        <div id="settings-content-inner">
          <SettingsName
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            conversations={conversations}
            setConversations={setConversations}
            socket={socket}
          />
          <br></br>

          <SettingsUsers
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            conversations={conversations}
            setConversations={setConversations}
            socket={socket}
          />

          {selectedConversation.conversationId && (
            <SettingsLeave
              selectedConversation={selectedConversation}
              setSelectedConversation={setSelectedConversation}
              conversations={conversations}
              setConversations={setConversations}
              setShowSettings={setShowSettings}
              socket={socket}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
