import React, { useState } from "react";

const URL = "RemovedIP";

const MessageField = (props) => {
  const {
    socket,
    messages,
    setMessages,
    setConversations,
    conversations,
  } = props;
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(URL + "send_message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversationId: props.conversationId,
        senderId: localStorage.getItem("token"),
        senderUser: localStorage.getItem("username"),
        message: newMessage,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (
          conversations.find(
            (conversation) => conversation._id === props.conversationId
          )
        ) {
          console.log("new mess");
          socket.emit("new_message", data);

          const newConversations = [...conversations];
          const index = newConversations.findIndex(
            (conversation) => conversation._id === props.conversationId
          );
          newConversations[index].lastMessage = {
            message: newMessage,
            sender: localStorage.getItem("username"),
            _id: data._id,
          };
          newConversations[index].updatedAt = data.updatedAt;
          newConversations[index].read = true;
          setConversations(newConversations);
        } else {
          const userId = localStorage.getItem("token");
          const filteredRecipients = data.recipients.filter(
            (recipient) => recipient.userId.toString() !== userId
          );
          const filteredData = {
            _id: data._id,
            recipients: filteredRecipients,
            lastMessage: data.message,
            updatedAt: data.updatedAt,
            read: true,
          };
          setConversations([...conversations, filteredData]);
          console.log("new conv");
          socket.emit("new_conversation", filteredData);
        }
        setMessages([...messages, data.message]);
        setNewMessage("");
      });
  };

  return (
    <form id="messages-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Send message"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default MessageField;
