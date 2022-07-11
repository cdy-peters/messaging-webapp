import React, { useState, useEffect } from "react";

const URL = "RemovedIP";

const SettingsUsers = (props) => {
  const { selectedConversation, conversations, setConversations } = props;
  const [addUserSearch, setAddUserSearch] = useState("");
  const [addUsers, setAddUsers] = useState([]);

  const conversation = conversations.find(
    (conversation) => conversation._id === selectedConversation.conversationId
  );

  const handleChange = (e) => {
    setAddUserSearch(e.target.value);
  };

  const handleClick = (e) => {
    fetch(URL + "add_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("token"),
        conversationId: selectedConversation.conversationId,
        recipientId: e.currentTarget.dataset.id,
        recipientUsername: e.currentTarget.dataset.username,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setAddUsers([]);
        setAddUserSearch("");

        const newConversations = conversations.map((conversation) => {
          if (conversation._id === selectedConversation.conversationId) {
            return {
              ...conversation,
              recipients: data,
            };
          }
          return conversation;
        });

        setConversations(newConversations);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (addUserSearch) {
      async function getUsers() {
        const response = await fetch(URL + "get_users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: localStorage.getItem("token"),
            search: addUserSearch,
          }),
        });
        const data = await response.json();

        if (data.length > 0) {
          if (
            conversation.recipients.some(
              (recipient) => recipient.username === addUserSearch
            )
          ) {
            setAddUsers([]);
          } else {
            setAddUsers(data);
          }
        } else {
          setAddUsers([]);
        }
      }
      getUsers();
    }
  }, [addUserSearch]);

  return (
    <div id="settings-users">
      <h3>Users</h3>
      <ul>
        {conversation.recipients.map((user) => (
          <li key={user._id}>{user.username}</li>
        ))}
      </ul>

      <form>
        <input
          id="user-search"
          type="text"
          value={addUserSearch}
          placeholder="Search for users"
          onChange={handleChange}
        />
      </form>

      {addUsers.map((user) => (
        <div key={user._id}>
          {user.username}
          <button
            data-id={user._id}
            data-username={user.username}
            onClick={handleClick}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default SettingsUsers;
