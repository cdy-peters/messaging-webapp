import React from "react";

import MessagesHeader from "./messagesHeader";
import MessageHistory from "./messageHistory";
import MessageField from "./messageField";

const Messages = (props) => {
  const { socket, conversations, setConversations, messages, setMessages } = props;
  const { conversationId, username } = props.selectedConversation;

  return (
    <div>
      <MessagesHeader username={username} />

      <MessageHistory
        socket={socket}
        messages={messages}
        setMessages={setMessages}
        conversationId={conversationId}
        setConversations={setConversations}
        conversations={conversations}
      />
      <MessageField
        socket={socket}
        messages={messages}
        setMessages={setMessages}
        conversationId={conversationId}
        setConversations={setConversations}
        conversations={conversations}
      />
    </div>
  );
};

export default Messages;
