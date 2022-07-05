import React from "react";

const ConversationsHeader = () => {
  return (
    <div id="conversations-header">
      <h3 id="conversations-title">{localStorage.getItem("username")}</h3>

      <button
        id="logout-button"
        onClick={() => {
          localStorage.removeItem("username");
          localStorage.removeItem("token");
          window.location.reload();
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default ConversationsHeader;
