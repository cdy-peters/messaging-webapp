import React, { useEffect, useRef } from "react";

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
    notifications,
    setNotifications,
  } = props;

  const messagesBottom = useRef(null);

  const scrollBottom = () => {
    messagesBottom.current.scrollIntoView();
  };

  useEffect(() => {
    scrollBottom();
  }, [messages]);

  return (
    <div>
      <MessagesHeader
        notifications={notifications}
        conversations={conversations}
      />
      <div id="messages-content">
        <MessageHistory
          socket={socket}
          messages={messages}
          setMessages={setMessages}
          setConversations={setConversations}
          conversations={conversations}
          setNotifications={setNotifications}
        />
        <div>
          <MessageField
            socket={socket}
            messages={messages}
            setMessages={setMessages}
            setConversations={setConversations}
            conversations={conversations}
          />
        </div>

        <div ref={messagesBottom}></div>
      </div>
    </div>
  );
};

export default Messages;
