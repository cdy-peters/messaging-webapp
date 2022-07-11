import React, { useEffect, useState } from "react";
import moment from "moment";

const URL = "RemovedIP";

const ExistingConversations = (props) => {
  const [filteredConversations, setFilteredConversations] = useState([]);
  const {
    conversations,
    setConversations,
    setSelectedConversation,
    search,
    socket,
  } = props;

  const handleClick = (e) => {
    var name;

    if (e.currentTarget.dataset.name) {
      name = e.currentTarget.dataset.name;
    } else {
      name = "All users left";
    }

    setSelectedConversation({
      conversationId: e.currentTarget.dataset.id,
      name: name,
    });

    const index = conversations.findIndex(
      (conversation) => conversation._id === e.currentTarget.dataset.id
    );
    if (conversations[index].read === false) {
      fetch(URL + "read_conversation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId: e.currentTarget.dataset.id,
          userId: localStorage.getItem("token"),
        }),
      });

      const newConversations = [...conversations];
      newConversations[index].read = true;
      setConversations(newConversations);
    }
  };

  useEffect(() => {
    async function getConversations() {
      const response = await fetch(URL + "get_conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("token"),
        }),
      });
      const data = await response.json();

      setConversations(data);
    }
    getConversations();
  }, []);

  useEffect(() => {
    if (search) {
      // eslint-disable-next-line array-callback-return
      const filtered = conversations.filter((conversation) => {
        if (
          conversation.recipients.some((recipient) =>
            recipient.username.includes(search)
          )
        ) {
          return conversation;
        }
      });
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [search, conversations]);

  useEffect(() => {
    socket.on("new_conversation", (data) => {
      setConversations([...conversations, data]);
    });
  }, [socket]);

  const conversationName = (conversation) => {
    if (conversation.name) {
      return conversation.name;
    } else {
      const usernames = conversation.recipients.map((recipient) => {
        return recipient.username;
      });
      if (usernames.length > 0) {
        return usernames.join(", ");
      } else {
        return "All users left";
      }
    }
  };

  const messagePreview = (conversation) => {
    if (conversation.recipients.length <= 1) {
      return (
        <p className="message-preview">{conversation.lastMessage.message}</p>
      );
    } else {
      return (
        <p className="message-preview">
          {conversation.lastMessage.sender}: {conversation.lastMessage.message}
        </p>
      );
    }
  };

  const conversationDetails = (conversation) => {
    return (
      <div>
        <span>
          {conversationName(conversation)}

          <p style={{ float: "right", margin: 0 }}>
            {moment(conversation.updatedAt).fromNow()}
          </p>
        </span>
        {messagePreview(conversation)}
      </div>
    );
  };

  const renderConversations = (conversation) => {
    if (conversation.read) {
      return conversationDetails(conversation);
    } else {
      return (
        <div>
          <b>{conversationDetails(conversation)}</b>
        </div>
      );
    }
  };

  return (
    <div>
      <p className="conversations-subtitle">Conversations</p>

      {!search && filteredConversations.length === 0 && (
        <p>
          You have no existing conversations. <br></br> Search for a username
          and start a conversation!
        </p>
      )}

      {search && filteredConversations.length === 0 && (
        <p>No conversations found</p>
      )}

      {filteredConversations
        .sort((a, b) => {
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        })
        .map((conversation) => (
          <div key={conversation._id}>
            <button
              id="conversation-button"
              data-id={conversation._id}
              data-name={conversationName(conversation)}
              onClick={handleClick}
            >
              {renderConversations(conversation)}
            </button>
          </div>
        ))}
    </div>
  );
};

export default ExistingConversations;
