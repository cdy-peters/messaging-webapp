import React, { useEffect, useState } from "react";
import { useContextProvider } from "../../utils/context";

const URL = "RemovedIP";

const NewConversations = (props) => {
  const { conversations, search, setMessages } = props;

  const {
    setActiveComponent,
    setSelectedConversation,
    setShowSettings,
  } = useContextProvider();

  const [users, setUsers] = useState([]);
  const [conversationExists, setConversationExists] = useState(false);

  const individualConversations = conversations.filter(
    (conversation) => conversation.recipients.length === 1
  );

  const handleClick = (e) => {
    setActiveComponent("messages");
    setShowSettings(false);

    setMessages([]);

    setSelectedConversation({
      conversationId: null,
      name: "",
      recipients: [
        {
          username: e.target.innerText,
          userId: e.target.dataset.id,
        },
      ],
    });
  };

  useEffect(() => {
    setConversationExists(false);
    if (search) {
      async function getUsers() {
        const response = await fetch(URL + "get_users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("token"),
            search: search,
          }),
        });
        const data = await response.json();

        if (data.length > 0) {
          if (
            individualConversations.some((conversation) =>
              conversation.recipients.some(
                (recipient) => recipient.username === search
              )
            )
          ) {
            setConversationExists(true);
            setUsers([]);
          } else {
            setUsers(data);
          }
        } else {
          setUsers([]);
        }
      }
      getUsers();
    } else {
      setUsers([]);
    }
  }, [search, conversations]);

  return (
    <div id="new-conversations">
      {search && (
        <p className="conversations-subtitle">Start a New Conversation</p>
      )}

      {search && conversationExists && (
        <p>You already have a conversation with this user</p>
      )}

      {search && users.length === 0 && !conversationExists && (
        <p>
          User does not exist. <br></br> Make sure you correctly entered their
          full username
        </p>
      )}

      {users.map((user) => (
        <button
          id="conversation-button"
          key={user._id}
          data-id={user._id}
          data-username={user.username}
          onClick={handleClick}
        >
          {user.username}
        </button>
      ))}
    </div>
  );
};

export default NewConversations;
