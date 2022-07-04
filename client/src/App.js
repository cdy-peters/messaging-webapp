import "bootstrap/dist/css/bootstrap.min.css";

import React from "react";
import { Route, Routes } from "react-router-dom";

import useToken from "./utils/useToken";

import Entry from "./components/Entry/entry";
import Home from "./components/home";

const App = () => {
  const { token, setToken } = useToken();

  if (!token) {
    return <Entry setToken={setToken} />;
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};

export default App;
