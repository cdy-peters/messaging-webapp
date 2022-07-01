import React, { useState } from "react";

import ExistingConversation from "./existingConversation";
import NewConversation from "./newConversation";
import Messages from "../Messages/messages";

const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <div className="display-flex">
      <div>
        <ExistingConversation
          conversations={conversations}
          setConversations={setConversations}
          setSelectedConversation={setSelectedConversation}
          setSelectedUser={setSelectedUser}
        />
        <NewConversation
          users={users}
          setUsers={setUsers}
          setSelectedUser={setSelectedUser}
          setSelectedConversation={setSelectedConversation}
        />
      </div>

      <div>
        {selectedConversation && (
          <Messages
            conversationId={selectedConversation}
            recipientId={selectedUser}
          />
        )}

        {selectedUser && (
          <Messages
            conversationId={selectedConversation}
            recipientId={selectedUser}
          />
        )}
      </div>
    </div>
  );
};

export default Conversations;
