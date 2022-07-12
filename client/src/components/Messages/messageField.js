import React, { useState } from "react";

const URL = "RemovedIP";

const MessageField = (props) => {
  const {
    socket,
    messages,
    setMessages,
    setConversations,
    conversations,
    conversationId,
    selectedConversation,
    setSelectedConversation,
  } = props;
  const [newMessage, setNewMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (conversationId) {
      fetch(URL + "send_message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: conversationId,
          senderId: localStorage.getItem("token"),
          senderUsername: localStorage.getItem("username"),
          message: newMessage,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          const newConversations = conversations.map((conversation) => {
            if (conversation._id === conversationId) {
              conversation.lastMessage = data.lastMessage;
              conversation.updatedAt = data.updatedAt;

              socket.emit("new_message", {
                conversationId: conversationId,
                recipients: conversation.recipients,
                message: data.lastMessage,
                updatedAt: data.updatedAt,
              });
            }
            return conversation;
          });
          console.log(conversations);
          console.log(newConversations);
          console.log(data);
          setConversations(newConversations);
          setMessages([...messages, data.lastMessage]);
          setNewMessage("");
        })
        .catch((err) => console.log(err));
    } else {
      fetch(URL + "new_conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("token"),
          username: localStorage.getItem("username"),
          recipientId: selectedConversation.recipientId,
          recipientUsername: selectedConversation.name,
          message: newMessage,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          socket.emit("new_conversation", data);

          setConversations([...conversations, data]);
          setSelectedConversation({
            conversationId: data._id,
            name: selectedConversation.name,
          });
          setMessages([...messages, data.lastMessage]);
          setNewMessage("");
        });
    }

    // fetch(URL + "send_message", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     conversationId: props.conversationId,
    //     senderId: localStorage.getItem("token"),
    //     senderUser: localStorage.getItem("username"),
    //     message: newMessage,
    //   }),
    // })
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (
    //       conversations.find(
    //         (conversation) => conversation._id === props.conversationId
    //       )
    //     ) {

    //       socket.emit("new_message", data);

    //       const newConversations = [...conversations];
    //       const index = newConversations.findIndex(
    //         (conversation) => conversation._id === props.conversationId
    //       );
    //       newConversations[index].lastMessage = {
    //         message: newMessage,
    //         sender: localStorage.getItem("username"),
    //         _id: data._id,
    //       };
    //       newConversations[index].updatedAt = data.updatedAt;
    //       newConversations[index].read = true;
    //       setConversations(newConversations);
    //     } else {
    //       const userId = localStorage.getItem("token");
    //       const filteredRecipients = data.recipients.filter(
    //         (recipient) => recipient.userId.toString() !== userId
    //       );
    //       const filteredData = {
    //         _id: data._id,
    //         recipients: filteredRecipients,
    //         lastMessage: data.message,
    //         updatedAt: data.updatedAt,
    //         read: true,
    //       };
    //       setConversations([...conversations, filteredData]);

    //       socket.emit("new_conversation", filteredData);
    //     }
    //     setMessages([...messages, data.message]);
    //     setNewMessage("");
    //   });
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
