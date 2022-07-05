import React from "react";

const ConversationsHeader = () => {
  return (
    <button
      onClick={() => {
        localStorage.removeItem("token");
        window.location.reload();
      }}
    >
      Logout
    </button>
  );
};

export default ConversationsHeader;
