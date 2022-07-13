import React from "react";

import MessagesHeader from "./messagesHeader";
import MessageHistory from "./messageHistory";
import MessageField from "./messageField";

const Messages = (props) => {
  const {
    socket,
    conversations,
    setConversations,
    messages,
    setMessages,
    setShowSettings,
    notifications,
    setNotifications,
    selectedConversation,
    setSelectedConversation,
  } = props;
  const { conversationId } = props.selectedConversation;

  return (
    <div>
      <MessagesHeader
        setShowSettings={setShowSettings}
        notifications={notifications}
        selectedConversation={selectedConversation}
      />

      {!selectedConversation.conversationId && (
        <div id="new-conversation-alert">
          Conversation will not be started until you send a message
        </div>
      )}

      <MessageHistory
        socket={socket}
        messages={messages}
        setMessages={setMessages}
        conversationId={conversationId}
        setConversations={setConversations}
        conversations={conversations}
        setNotifications={setNotifications}
      />
      <MessageField
        socket={socket}
        messages={messages}
        setMessages={setMessages}
        conversationId={conversationId}
        setConversations={setConversations}
        conversations={conversations}
        selectedConversation={selectedConversation}
        setSelectedConversation={setSelectedConversation}
      />
    </div>
  );
};

export default Messages;
