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
  const { conversationId, name } = props.selectedConversation;

  return (
    <div>
      <MessagesHeader
        name={name}
        setShowSettings={setShowSettings}
        notifications={notifications}
      />

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
