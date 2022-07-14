import React from "react";

const SearchConversations = (props) => {
  const { search, setSearch } = props;

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div id="conversations-search">
      <input
        id="conversations-search-input"
        type="text"
        value={search}
        placeholder="Search for conversations"
        onChange={handleChange}
      />
    </div>
  );
};

export default SearchConversations;
