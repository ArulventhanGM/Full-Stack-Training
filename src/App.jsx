import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Search from "./components/Search";
import AOS from 'aos';
import 'aos/dist/aos.css';

const API_BASE_URL = "https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_API_KEY;


const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

function App() {
  const[searchTerm,setSearchTerm]=useState('');
  const[movies,setMovies]=useState([]);
  const[loading,setLoading]=useState(false);
  const[isSearchResults,setIsSearchResults]=useState(false);

const fetchMovies= async () =>{
  setLoading(true);
  setIsSearchResults(false);
  try{
    const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
    const response = await fetch(endpoint,API_OPTIONS);
    const data = await response.json();
    console.log(data);
    setMovies(data.results || []);
  }catch(error){
      console.log(`Error fetching movie: ${error}`);
  } finally {
    setLoading(false);
  }
};

const searchMovies = async (query) => {
  setLoading(true);
  setIsSearchResults(true);
  try {
    const endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`;
    const response = await fetch(endpoint, API_OPTIONS);
    const data = await response.json();
    console.log('Search results:', data);
    setMovies(data.results || []);
  } catch (error) {
    console.log(`Error searching movies: ${error}`);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  fetchMovies();
  // Initialize AOS for scroll animations
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
  });
}, []);


  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <motion.header
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <motion.div 
            className="hero-image-container"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <img src="hero.png" alt="" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Find<span className="text-gradient">Movies</span> You'll Enjoy Without Hassle
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={searchMovies}/>
          </motion.div>
        </motion.header>
        
        {/* Movies Display Section */}
        <section className="movies-section">
          {loading && (
            <motion.div 
              className="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Loading movies...
            </motion.div>
          )}
          
          {!loading && movies.length > 0 && (
            <motion.div 
              className="movies-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="movies-header" data-aos="fade-up">
                <h2>{isSearchResults ? `Search Results for "${searchTerm}"` : 'Popular Movies'}</h2>
                {isSearchResults && (
                  <button 
                    className="back-to-popular" 
                    onClick={() => {
                      setSearchTerm('');
                      setIsSearchResults(false);
                      fetchMovies();
                    }}
                  >
                    Back to Popular Movies
                  </button>
                )}
              </div>
              <div className="movies-grid">
                {movies.slice(0, 12).map((movie, index) => (
                  <motion.div 
                    key={movie.id} 
                    className="movie-card"
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                    whileHover={{ 
                      scale: 1.05,
                      y: -10,
                      transition: { duration: 0.3 }
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="movie-poster-container">
                      <img 
                        src={movie.poster_path 
                          ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                          : 'no-movie.png'
                        } 
                        alt={movie.title}
                        className="movie-poster"
                      />
                      <motion.div 
                        className="movie-overlay"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="overlay-content">
                          <h4>{movie.title}</h4>
                          <div className="overlay-rating">
                            <span>⭐ {movie.vote_average.toFixed(1)}</span>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      <p className="movie-year">{new Date(movie.release_date).getFullYear()}</p>
                      <div className="movie-rating">
                        <span>⭐ {movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
          
          {!loading && movies.length === 0 && (
            <motion.div 
              className="no-movies"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              {isSearchResults 
                ? `No movies found for "${searchTerm}". Try a different search term.`
                : 'No movies found. Please check your API key.'
              }
            </motion.div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App