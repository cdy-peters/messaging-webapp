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

      <SettingsName
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
        conversations={conversations}
        setConversations={setConversations}
        socket={socket}
      />

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
  );
};

export default Settings;
