import React, { useState } from "react";

import ExistingConversation from "./existingConversation";
import NewConversation from "./newConversation";
import Messages from "../Messages/messages";

const Conversations = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);

  return (
    <div className="display-flex">
      <div>
        <ExistingConversation
          setSelectedConversation={setSelectedConversation}
        />
        <NewConversation setSelectedConversation={setSelectedConversation} />
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
