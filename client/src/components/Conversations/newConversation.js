import React, { useEffect, useState } from "react";

const NewConversations = (props) => {
  const [users, setUsers] = useState([]);

  const { setSelectedConversation, search } = props;

  const handleClick = (e) => {
    fetch("http://localhost:5000/new_conversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("token"),
        recipientId: e.target.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSelectedConversation({ conversationId: data._id, username: e.target.innerText });
      });
  };

  useEffect(() => {
    if (search) {
      async function getUsers() {
        const response = await fetch("http://localhost:5000/get_users", {
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

        setUsers(data);
      }
      getUsers();
    } else {
      setUsers([]);
    }
  }, [search]);

  return (
    <div>
      <h1>New Conversation</h1>

      {users.map((user) => (
        <button key={user._id} value={user._id} onClick={handleClick}>
          {user.username}
        </button>
      ))}
    </div>
  );
};

export default NewConversations;
