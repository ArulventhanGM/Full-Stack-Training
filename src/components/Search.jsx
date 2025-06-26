import { useState } from 'react';

const Search = ({ searchTerm, setSearchTerm, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          Search
        </button>
      </div>
    </form>
  );
};

export default Search;
