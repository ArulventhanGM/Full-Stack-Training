import { useState } from 'react';
import { motion } from 'framer-motion';

const Search = ({ searchTerm, setSearchTerm, onSearch }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      console.log('Searching for:', searchTerm);
      onSearch(searchTerm);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-form">
      <motion.div 
        className="search-container"
        animate={{ 
          scale: isFocused ? 1.05 : 1,
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <motion.input
          type="text"
          placeholder="Search for movies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="search-input"
          animate={{
            boxShadow: isFocused 
              ? "0 0 30px rgba(100, 108, 255, 0.4)" 
              : "0 0 0px rgba(100, 108, 255, 0)"
          }}
          transition={{ duration: 0.3 }}
        />
        <motion.button 
          type="submit" 
          className="search-button"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          Search
        </motion.button>
      </motion.div>
    </form>
  );
};

export default Search;
