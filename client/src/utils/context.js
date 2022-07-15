import React, { createContext, useContext, useState } from "react";

const Context = createContext();

const ContextProvider = ({ children }) => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  return (
    <Context.Provider
      value={{
        selectedConversation,
        setSelectedConversation,
        showSettings,
        setShowSettings,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useContextProvider = () => useContext(Context);

export default ContextProvider;
