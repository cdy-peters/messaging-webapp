import React, { useState, useEffect } from "react";
import { useContextProvider } from "../../utils/context";

const URL = process.env.REACT_APP_URL;

const SettingsUsers = (props) => {
  const { conversations, setConversations, socket } = props;

  const {
    selectedConversation,
    setSelectedConversation,
  } = useContextProvider();

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
        username: localStorage.getItem("username"),
        conversationId: selectedConversation.conversationId,
        recipientId: e.target.value,
        recipientUsername: e.target.dataset.username,
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

        const recipients = newConversations.find(
          (conversation) =>
            conversation._id === selectedConversation.conversationId
        ).recipients;

        socket.emit("owner_updated", {
          conversationId: selectedConversation.conversationId,
          oldOwner: localStorage.getItem("token"),
          newOwner: e.target.value,
          recipients: recipients,
          notification: data.notification,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAdd = (e) => {
    if (selectedConversation.conversationId) {
      fetch(URL + "add_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("token"),
          username: localStorage.getItem("username"),
          conversationId: selectedConversation.conversationId,
          recipientId: e.currentTarget.dataset.id,
          recipientUsername: e.currentTarget.dataset.username,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const newRecipient = data.newRecipient;
          const notification = data.notification;
          const new_user_data = data.new_user_data;

          setAddUsers([]);
          setAddUserSearch("");

          const newConversations = conversations.map((conversation) => {
            if (conversation._id === selectedConversation.conversationId) {
              socket.emit("add_user", {
                conversationId: selectedConversation.conversationId,
                recipients: [...conversation.recipients, newRecipient],
                newRecipient,
                notification,
                new_user_data,
              });

              return {
                ...conversation,
                recipients: [...conversation.recipients, newRecipient],
              };
            }
            return conversation;
          });

          setConversations(newConversations);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const newRecipient = {
        username: e.currentTarget.dataset.username,
        userId: e.currentTarget.dataset.id,
      };

      setAddUsers([]);
      setAddUserSearch("");

      setSelectedConversation({
        ...selectedConversation,
        recipients: [...selectedConversation.recipients, newRecipient],
      });
    }
  };

  const handleRemove = (e) => {
    if (selectedConversation.conversationId) {
      fetch(URL + "remove_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("token"),
          username: localStorage.getItem("username"),
          conversationId: selectedConversation.conversationId,
          recipientId: e.target.value,
          recipientUsername: e.target.dataset.username,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          const newRecipients = data.newRecipients;

          const newConversations = conversations.map((conversation) => {
            if (conversation._id === selectedConversation.conversationId) {
              socket.emit("remove_user", {
                conversationId: selectedConversation.conversationId,
                recipients: newRecipients,
                removedRecipient: data.removedRecipient,
                notification: data.notification,
              });

              return {
                ...conversation,
                recipients: newRecipients,
              };
            }
            return conversation;
          });

          setConversations(newConversations);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      const newRecipients = selectedConversation.recipients.filter(
        (recipient) => recipient.userId !== e.target.value
      );

      setSelectedConversation({
        ...selectedConversation,
        recipients: newRecipients,
      });
    }
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
          if (selectedConversation.conversationId) {
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
            if (
              selectedConversation.recipients.some(
                (recipient) => recipient.username === addUserSearch
              )
            ) {
              setAddUsers([]);
            } else {
              setAddUsers(data);
            }
          }
        } else {
          setAddUsers([]);
        }
      }
      getUsers();
    }
  }, [addUserSearch]);

  const currentUsers = (conversation) => {
    if (conversation) {
      if (conversation.role === "owner") {
        return conversation.recipients.map((user) => (
          <div key={user._id} className="manage-user">
            {user.username}
            <div>
              <button
                id="make-owner-button"
                value={user.userId}
                data-username={user.username}
                onClick={handleOwner}
              >
                Make owner
              </button>
              <button
                id="remove-button"
                value={user.userId}
                data-username={user.username}
                onClick={handleRemove}
              >
                Remove
              </button>
            </div>
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
    } else {
      if (selectedConversation.recipients.length === 1) {
        return selectedConversation.recipients.map((user) => (
          <div key={user.userId} className="manage-user">
            {user.username}
            <button
              id="remove-button"
              value={user.userId}
              onClick={handleRemove}
              disabled
            >
              Remove
            </button>
          </div>
        ));
      } else {
        return selectedConversation.recipients.map((user) => (
          <div key={user.userId} className="manage-user">
            {user.username}
            <button
              id="remove-button"
              value={user.userId}
              onClick={handleRemove}
            >
              Remove
            </button>
          </div>
        ));
      }
    }
  };

  return (
    <div id="settings-users">
      <div id="current-users">
        <h5>Manage users</h5>
        {currentUsers(conversation)}
      </div>
      <br></br>
      <div id="add-users">
        <h5>Add users</h5>
        <input
          id="user-search"
          type="text"
          value={addUserSearch}
          placeholder="Search for users"
          onChange={handleChange}
        />

        {addUsers.map((user) => (
          <div key={user._id} className="manage-user">
            {user.username}
            <button
              id="add-button"
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
