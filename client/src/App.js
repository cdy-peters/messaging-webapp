import "bootstrap/dist/css/bootstrap.min.css";
import { useMediaQuery } from "react-responsive";

import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useContextProvider } from "./utils/context";

import useToken from "./utils/useToken";

import Entry from "./components/Entry/entry";
import Home from "./components/home";

// var prevMobile;

const App = () => {
  const [changeMobile, setChangeMobile] = useState(false);
  const { token, setToken } = useToken();
  const { setActiveComponent, setSelectedConversation } = useContextProvider();

  const handleChange = () => {
    setSelectedConversation(null);
    setActiveComponent("conversations");
    setChangeMobile(!changeMobile);
  }

  const isMobile = useMediaQuery(
    { maxWidth: 767 },
    undefined,
    handleChange
  );

  if (!token) {
    return <Entry setToken={setToken} />;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home key={changeMobile} isMobile={isMobile} />} />
      </Routes>
    </div>
  );
};

export default App;
