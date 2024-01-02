
//how can we send POST request when we clichk add movie to submit that movie data we collect to Firebase
import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('https://react-http-5a142-default-rtdb.firebaseio.com/movies.json');
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }

      const data = await response.json();
       // Display the our data
       const loadedMovies = [];
       //to loop through all the keys in data,b/c data is now an object
       for (const key in data){
         loadedMovies.push({
          id: key,
          title:data[key].title,
          openingText:data[key].openingText,
          releaseDate:data[key].releaseDate,
         }); //push a new object anew object for every key value pair we got in the response data & id === key
       }//now loadedMovies array is an array full of object

     
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

 async function addMovieHandler(movie) {
     //we also use fetch API to send data to the backend app or to database
    const response = await fetch('https://react-http-5a142-default-rtdb.firebaseio.com/movies.json', {
      method: 'POST', // to send a POST request by default it is GET request.if we send a POST request to firebase, firebase will go ahead and creat aresource in the databse
        //what happened when we send a POST request is deppend on the backend we are using (not always create a resource), here for Firebase sending a POST request will create a resource
        body: JSON.stringify(movie), //so we also need to add that resource which should be stored.we do that with the body option on fetch API configurtion object.here we wanna send movie,
        // though body doesnot want a javascript object like this,instead it want JSON data(data format which is typically used for exchanging data b/n front-end and backend)
        headers: {
             'Content-Type' : 'application/json'//this header discribe the content that will be sent
        }
    });
    const data = await response.json(); //b/c Firebase also sends back data in JSON format
    console.log(data);
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
