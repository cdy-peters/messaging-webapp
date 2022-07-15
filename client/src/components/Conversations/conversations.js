import React, { useState, useEffect } from "react";
import { useContextProvider } from "../../utils/context";

import ConversationsHeader from "./conversationsHeader";
import SearchConversations from "./searchConversations";
import ExistingConversation from "./existingConversation";
import NewConversation from "./newConversation";

const URL = "RemovedIP";
var selectChat;

const Conversations = (props) => {
  const {
    socket,
    conversations,
    setConversations,
    setMessages,
    setNotifications,
  } = props;

  const {
    selectedConversation,
    setSelectedConversation,
  } = useContextProvider();

  const [search, setSearch] = useState("");

  try {
    selectChat = selectedConversation.conversationId;
  } catch (error) {
    selectChat = null;
  }

  useEffect(() => {
    socket.on("new_message", (data) => {
      var read = false;

      if (data.conversationId === selectChat) {
        setMessages((messages) => [...messages, data.message]);
        read = true;

        fetch(URL + "read_conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            conversationId: data.conversationId,
            userId: localStorage.getItem("token"),
          }),
        });
      }

      setConversations((conversations) => {
        const newConversations = [...conversations];
        const index = newConversations.findIndex(
          (conversation) => conversation._id === data.conversationId
        );
        newConversations[index].lastMessage = {
          message: data.message.message,
          sender: data.message.sender,
          _id: data.message._id,
        };
        newConversations[index].updatedAt = data.updatedAt;
        newConversations[index].read = read;
        return newConversations;
      });
    });
  }, [socket]);

  useEffect(() => {
    socket.on("update_conversation_name", (data) => {
      setConversations((conversations) => {
        const newConversations = [...conversations];
        const index = newConversations.findIndex(
          (conversation) => conversation._id === data.conversationId
        );
        newConversations[index].name = data.name;
        return newConversations;
      });

      if (data.conversationId === selectChat) {
        setSelectedConversation((selectedConversation) => {
          const newSelectedConversation = { ...selectedConversation };
          if (newSelectedConversation.conversationId === data.conversationId) {
            newSelectedConversation.name = data.name;
          }
          return newSelectedConversation;
        });

        setNotifications((notifications) => [
          ...notifications,
          data.notification,
        ]);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on("add_user", (data) => {
      setConversations((conversations) => {
        const newConversations = [...conversations];
        const index = newConversations.findIndex(
          (conversation) => conversation._id === data.conversationId
        );
        newConversations[index].recipients.push(data.newRecipient);
        return newConversations;
      });

      if (data.conversationId === selectChat) {
        setNotifications((notifications) => [
          ...notifications,
          data.notification,
        ]);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on("remove_user", (data) => {
      if (data.removedRecipient === localStorage.getItem("token")) {
        setConversations((conversations) => {
          const newConversations = [...conversations];
          const index = newConversations.findIndex(
            (conversation) => conversation._id === data.conversationId
          );
          newConversations.splice(index, 1);
          return newConversations;
        });

        if (data.conversationId === selectChat) {
          setSelectedConversation(null);
        }
      } else {
        setConversations((conversations) => {
          const newConversations = [...conversations];
          const index = newConversations.findIndex(
            (conversation) => conversation._id === data.conversationId
          );
          newConversations[index].recipients = newConversations[
            index
          ].recipients.filter(
            (recipient) => recipient.userId !== data.removedRecipient
          );
          return newConversations;
        });

        if (data.conversationId === selectChat) {
          setNotifications((notifications) => [
            ...notifications,
            data.notification,
          ]);
        }
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on("user_left", (data) => {
      setConversations((conversations) => {
        const newConversations = [...conversations];
        const index = newConversations.findIndex(
          (conversation) => conversation._id === data.conversationId
        );
        newConversations[index].recipients = newConversations[
          index
        ].recipients.filter((recipient) => recipient.userId !== data.leftUser);
        return newConversations;
      });

      if (data.conversationId === selectChat) {
        setNotifications((notifications) => [
          ...notifications,
          data.notification,
        ]);
      }
    });
  }, [socket]);

  useEffect(() => {
    socket.on("owner_updated", (data) => {
      setConversations((conversations) => {
        const newConversations = [...conversations];
        const index = newConversations.findIndex(
          (conversation) => conversation._id === data.conversationId
        );

        const newRecipients = newConversations[index].recipients.map(
          (recipient) => {
            if (recipient.userId === data.newOwner) {
              recipient.role = "owner";
            } else {
              recipient.role = "user";
            }
            return recipient;
          }
        );

        newConversations[index].recipients = newRecipients;
        if (data.newOwner === localStorage.getItem("token")) {
          newConversations[index].role = "owner";
        }

        return newConversations;
      });

      if (data.conversationId === selectChat) {
        setNotifications((notifications) => [
          ...notifications,
          data.notification,
        ]);
      }
    });
  }, [socket]);

  return (
    <div>
      <ConversationsHeader />

      <div id="conversations-inner">
        <SearchConversations search={search} setSearch={setSearch} />

        <NewConversation
          conversations={conversations}
          setConversations={setConversations}
          search={search}
          setMessages={setMessages}
        />

        <ExistingConversation
          socket={socket}
          conversations={conversations}
          setConversations={setConversations}
          search={search}
        />
      </div>
    </div>
  );
};

export default Conversations;
