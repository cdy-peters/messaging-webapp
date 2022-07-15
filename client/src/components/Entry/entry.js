import React, { useState } from "react";
import PropTypes from "prop-types";

import Register from "./register";
import Login from "./login";

const Entry = (props) => {
  const { setToken } = props;
  const [activeTab, setActiveTab] = useState("login");

  return (
    <div id="entry-outer">
      <div id="entry-inner">
        {activeTab === "login" ? (
          <Login setActiveTab={setActiveTab} setToken={setToken} />
        ) : (
          <Register setActiveTab={setActiveTab} setToken={setToken} />
        )}
      </div>
    </div>
  );
};

Entry.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Entry;
