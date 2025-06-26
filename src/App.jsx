import { useEffect,useState } from "react";
import Search from "./components/Search";

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


useEffect(()=> {
  fetchMovies();
}, []);


  return (
    <main>
      <div className="pattern" />
      <div className="wrapper">
        <header>
          <img src="hero.png" alt="" />
          <h1>Find<span className="text-gradient">Movies</span> You'll Enjoy Without Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={searchMovies}/>
        </header>
        
        {/* Movies Display Section */}
        <section className="movies-section">
          {loading && <div className="loading">Loading movies...</div>}
          
          {!loading && movies.length > 0 && (
            <div className="movies-container">
              <div className="movies-header">
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
                {movies.slice(0, 12).map((movie) => (
                  <div key={movie.id} className="movie-card">
                    <img 
                      src={movie.poster_path 
                        ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                        : 'no-movie.png'
                      } 
                      alt={movie.title}
                      className="movie-poster"
                    />
                    <div className="movie-info">
                      <h3 className="movie-title">{movie.title}</h3>
                      <p className="movie-year">{new Date(movie.release_date).getFullYear()}</p>
                      <div className="movie-rating">
                        <span>⭐ {movie.vote_average.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!loading && movies.length === 0 && (
            <div className="no-movies">
              {isSearchResults 
                ? `No movies found for "${searchTerm}". Try a different search term.`
                : 'No movies found. Please check your API key.'
              }
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default App