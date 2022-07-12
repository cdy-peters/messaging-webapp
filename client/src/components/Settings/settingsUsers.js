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

  const handleOwner = (e) => {
    fetch(URL + "update_owner", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("token"),
        conversationId: selectedConversation.conversationId,
        recipientId: e.target.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newConversations = conversations.map((conversation) => {
          if (conversation._id === selectedConversation.conversationId) {
            const newRecipients = conversation.recipients.map((recipient) => {
              if (recipient.userId.toString() === e.target.value) {
                return {
                  userId: recipient.userId,
                  username: recipient.username,
                  role: "owner",
                  read: recipient.read,
                  _id: recipient._id,
                };
              } else {
                return recipient;
              }
            });
            return {
              ...conversation,
              recipients: newRecipients,
              role: "user",
            };
          } else {
            return conversation;
          }
        });
        setConversations(newConversations);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAdd = (e) => {
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

  const handleRemove = (e) => {
    fetch(URL + "remove_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("token"),
        conversationId: selectedConversation.conversationId,
        recipientId: e.target.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
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

  const currentUsers = (conversation) => {
    if (conversation.role === "owner") {
      return conversation.recipients.map((user) => (
        <div key={user._id}>
          {user.username}
          <button value={user.userId} onClick={handleOwner}>
            Make owner
          </button>
          <button value={user.userId} onClick={handleRemove}>
            Remove
          </button>
        </div>
      ));
    } else {
      return conversation.recipients.map((user) => (
        <div key={user._id}>
          {user.username}
          {user.role === "owner" && <span> (owner)</span>}
        </div>
      ));
    }
  };

  return (
    <div id="settings-users">
      <div id="current-users">
        <h3>Users</h3>
        {currentUsers(conversation)}
      </div>

      <div id="add-users">
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
              onClick={handleAdd}
            >
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsUsers;
