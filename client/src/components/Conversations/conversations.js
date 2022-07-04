import React, { useState } from "react";

import Search from "./search";
import ExistingConversation from "./existingConversation";
import NewConversation from "./newConversation";
import Messages from "../Messages/messages";

const Conversations = () => {
  const [search, setSearch] = useState("");
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="display-flex">
      <div>
        <Search search={search} setSearch={setSearch} />

        <ExistingConversation
          setSelectedConversation={setSelectedConversation}
          search={search}
        />
        <NewConversation
          setSelectedConversation={setSelectedConversation}
          search={search}
        />
      </div>

      <div>
        {selectedConversation && (
          <Messages selectedConversation={selectedConversation} />
        )}
      </div>
    </div>
  );
};

export default Conversations;
