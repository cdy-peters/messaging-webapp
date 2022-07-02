import React, { useEffect, useState } from "react";

const NewConversations = (props) => {
  const [users, setUsers] = useState([]);

  const { setSelectedConversation } = props;

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
        setSelectedConversation(data._id);
      });
  };

  useEffect(() => {
    async function getUsers() {
      const response = await fetch("http://localhost:5000/get_users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: localStorage.getItem("token"),
        }),
      });
      const data = await response.json();

      setUsers(data);
    }
    getUsers();
  }, []);

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
