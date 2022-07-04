import React from "react";

const Search = (props) => {
  const { search, setSearch } = props;

  const handleChange = (e) => {
    setSearch(e.target.value);
  };

  return (
    <div>
      <input type="text" value={search} onChange={handleChange} />
    </div>
  );
};

export default Search;
