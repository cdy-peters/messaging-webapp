import React, { useEffect } from "react";
import moment from "moment";

const URL = "RemovedIP";

const MessageHistory = (props) => {
  const { messages, setMessages, conversationId, conversations } = props;

  const conversation = conversations.find(
    (conversation) => conversation._id === conversationId
  );

  useEffect(() => {
    async function getMessages() {
      const response = await fetch(URL + "get_messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
        }),
      });
      const data = await response.json();

      setMessages(data);
    }
    getMessages();
  }, [conversationId]);

  var prevTime;
  var prevSender;

  const renderMessage = (message) => {
    const time = moment(message.date).fromNow();

    if (!prevTime || prevTime !== time) {
      prevTime = time;
      prevSender = null;
      if (message.sender === localStorage.getItem("username")) {
        return (
          <div key={message._id} className="message-sent">
            <p className="messages-time">
              <span>{time}</span>
            </p>
            <p className="messages-message">{message.message}</p>
          </div>
        );
      } else {
        if (
          (!prevSender || prevSender !== message.sender) &&
          conversation.recipients.length > 1
        ) {
          prevSender = message.sender;
          return (
            <div key={message._id} className="message-received">
              <p className="messages-time">
                <span>{time}</span>
              </p>
              <p className="messages-sender">{message.sender}</p>
              <p className="messages-message">{message.message}</p>
            </div>
          );
        } else {
          return (
            <div key={message._id} className="message-received">
              <p className="messages-time">
                <span>{time}</span>
              </p>
              <p className="messages-message">{message.message}</p>
            </div>
          );
        }
      }
    } else {
      if (message.sender === localStorage.getItem("username")) {
        return (
          <div key={message._id} className="message-sent">
            <p className="messages-message">{message.message}</p>
          </div>
        );
      } else {
        if (
          (!prevSender || prevSender !== message.sender) &&
          conversation.recipients.length > 1
        ) {
          prevSender = message.sender;
          return (
            <div key={message._id} className="message-received">
              <p className="messages-sender">{message.sender}</p>
              <p className="messages-message">{message.message}</p>
            </div>
          );
        } else {
          return (
            <div key={message._id} className="message-received">
              <p className="messages-message">{message.message}</p>
            </div>
          );
        }
      }
    }
  };

  return <div>{messages.map((message) => renderMessage(message))}</div>;
};

export default MessageHistory;
