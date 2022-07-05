import React, { useState } from "react";

import ConversationsHeader from "./conversationsHeader";
import Search from "./search";
import ExistingConversation from "./existingConversation";
import NewConversation from "./newConversation";
import Messages from "../Messages/messages";

const Conversations = () => {
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="container">
      <div className="row" style={{ height: "100vh" }}>
        <div className="col-4" id="conversations">
          <ConversationsHeader />

          <Search search={search} setSearch={setSearch} />

          <NewConversation
            conversations={conversations}
            setSelectedConversation={setSelectedConversation}
            search={search}
          />

          <ExistingConversation
            conversations={conversations}
            setConversations={setConversations}
            setSelectedConversation={setSelectedConversation}
            search={search}
          />
        </div>

        <div className="col-8" id='messages'>
          {selectedConversation && (
            <Messages selectedConversation={selectedConversation} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversations;
