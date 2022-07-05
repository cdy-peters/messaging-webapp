import React from "react";

const Search = (props) => {
  const { search, setSearch } = props;

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <input
        id="conversation-search"
        type="text"
        value={search}
        placeholder="Search for conversations"
        onChange={handleChange}
      />
    </div>
  );
};

export default Search;
