//ORIGINAL API


// async function titleAKA() {
              
//   const title = document.getElementById("titleGet").value;
//   const captitle1 = title;

//   //split the above string into an array of strings 
//   //whenever a blank space is encountered

//   const arr = captitle1.split(" ");

//   //loop through each element of the array and capitalize the first letter.


//   for (var i = 0; i < arr.length; i++) {
//       arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);

//   }

//   //Join all the elements of the array back into a string 
//   //using a blankspace as a separator 
//   const captitle = arr.join(" ");
//   console.log(captitle);

//   if (!captitle) {
//   return;
//   }

//   const url = `https://moviesdatabase.p.rapidapi.com/titles/search/akas/${captitle}`
//   // const url = 'https://moviesdatabase.p.rapidapi.com/titles/search/akas/Dune';
//   const options = {
//     method: 'GET',
//     headers: {
//       'X-RapidAPI-Key': '2d42d5ca3dmshd28b866e3c63cb3p1e535bjsne14d801b9475',
//       'X-RapidAPI-Host': 'moviesdatabase.p.rapidapi.com'
//     }
//   };

//   try {
//     const response = await fetch(url, options);
//     const result = await response.json();
//     console.log(result)
//     // showMovies(result);
    
//   } catch (error) {
//     console.error(error);
//   }
// }


// tmdb API
const API_KEY = 'api_key=aeb85d16b333a4e890b3632d147b264f'
const BASE_URL = 'https://api.themoviedb.org/3'
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

getMovies(API_URL)

function getMovies(url) {
  fetch(url).then(res => res.json()).then(data => {
      console.log(data.results)
      showMovies(data.results);
  })
}

function showMovies(data) {
  data.forEach(movie => {
    const {title, poster_path, vote_average, overview} = movie;
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
          <img src = "${IMG_URL+poster_path}" alt = "${title}">

          <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
          </div>

          <div class="overview">
            <h3>Overview</h3>
            ${overview}
          </div>
          `

  })
}

function getColor(vote) {
  if (vote >= 8) {
    return 'green'
  }
}