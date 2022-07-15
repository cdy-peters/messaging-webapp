import React, { useState } from "react";

import ConversationsHeader from "./conversationsHeader";
import SearchConversations from "./searchConversations";
import ExistingConversation from "./existingConversation";
import NewConversation from "./newConversation";

const Conversations = (props) => {
  const { socket, conversations, setConversations, setMessages } = props;

  const [search, setSearch] = useState("");

  return (
    <div>
      <ConversationsHeader />

      <div id="conversations-inner">
        <SearchConversations search={search} setSearch={setSearch} />

        <NewConversation
          conversations={conversations}
          setConversations={setConversations}
          search={search}
          setMessages={setMessages}
        />

        <ExistingConversation
          socket={socket}
          conversations={conversations}
          setConversations={setConversations}
          search={search}
        />
      </div>
    </div>
  );
};

export default Conversations;
