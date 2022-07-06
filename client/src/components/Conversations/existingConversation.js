import React, { useEffect, useState } from "react";

const URL = 'RemovedIP';

const ExistingConversations = (props) => {
  const [filteredConversations, setFilteredConversations] = useState([]);
  const {
    conversations,
    setConversations,
    setSelectedConversation,
    search,
  } = props;

  const handleClick = (e) => {
    setSelectedConversation({
      conversationId: e.target.value,
      username: e.target.innerText,
    });
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

  return (
    <div>
      <p className="conversations-subtitle">Conversations</p>

      {(!search && filteredConversations.length === 0) && (
        <p>
          You have no existing conversations. <br></br> Search for a username
          and start a conversation!
        </p>
      )}

      {(search && filteredConversations.length === 0) && (
        <p>No conversations found</p>
      )}

      {filteredConversations.map((conversation) => (
        <button
          id="conversation-button"
          key={conversation._id}
          value={conversation._id}
          onClick={handleClick}
        >
          {conversation.recipients[0].username}
        </button>
      ))}
    </div>
  );
};

export default ExistingConversations;
