import React, { useEffect, useState } from "react";

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
    setSelectedConversation({
      conversationId: e.currentTarget.dataset.id,
      username: e.currentTarget.dataset.username,
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

  const conversationDetails = (conversation) => {
    if (conversation.read) {
      return (
        <div>
          <span>
            {conversation.recipients[0].username}
            <p style={{ float: "right", margin: 0 }}>
              {conversation.updatedAt}
            </p>
          </span>
          <p className="message-preview">{conversation.lastMessage.message}</p>
        </div>
      );
    } else {
      return (
        <div>
          <b>
            <span>
              {conversation.recipients[0].username}
              <p style={{ float: "right", margin: 0 }}>
                {conversation.updatedAt}
              </p>
            </span>
            <p className="message-preview">
              {conversation.lastMessage.message}
            </p>
          </b>
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

      {filteredConversations.map((conversation) => (
        <div key={conversation._id}>
          <button
            id="conversation-button"
            data-id={conversation._id}
            data-username={conversation.recipients[0].username}
            onClick={handleClick}
          >
            {conversationDetails(conversation)}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ExistingConversations;
