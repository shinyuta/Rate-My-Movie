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
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const genres = [
  {
     "id":28,
     "name":"Action"
  },
  {
     "id":12,
     "name":"Adventure"
  },
  {
     "id":16,
     "name":"Animation"
  },
  {
     "id":35,
     "name":"Comedy"
  },
  {
     "id":80,
     "name":"Crime"
  },
  {
     "id":99,
     "name":"Documentary"
  },
  {
     "id":18,
     "name":"Drama"
  },
  {
     "id":10751,
     "name":"Family"
  },
  {
     "id":14,
     "name":"Fantasy"
  },
  {
     "id":36,
     "name":"History"
  },
  {
     "id":27,
     "name":"Horror"
  },
  {
     "id":10402,
     "name":"Music"
  },
  {
     "id":9648,
     "name":"Mystery"
  },
  {
     "id":10749,
     "name":"Romance"
  },
  {
     "id":878,
     "name":"Science Fiction"
  },
  {
     "id":10770,
     "name":"TV Movie"
  },
  {
     "id":53,
     "name":"Thriller"
  },
  {
     "id":10752,
     "name":"War"
  },
  {
     "id":37,
     "name":"Western"
  }
];

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const button = document.getElementById('button');
const tagsEl = document.getElementById('tags');

var selectgenre = []
setgenre();
function setgenre() {
  tagsEl.innerHTML='';
  genres.forEach(genre => {
    const t = document.createElement('div');
    t.classList.add('tag')
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener('click', () => {
      if(selectgenre.length == 0) {
        selectgenre.push(genre.id);
      } else {
        if (selectgenre.includes(genre.id)) {
          selectgenre.forEach((id, idx) => {
            if(id == genre.id) {
              selectgenre.splice(idx, 1);
            }
          })
        } else {
          selectgenre.push(genre.id);
        }
      }
      console.log(selectgenre);
      getMovies(API_URL +'&with_genres=' + encodeURI(selectgenre.join(',')));
      genreHighlight();
    })
    tagsEl.append(t);
  })
}

function genreHighlight() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    tag.classList.remove('highlight')
  })
  clearbutton();
  if (selectgenre.length != 0){
    selectgenre.forEach(id => {
      const highlightedtag = document.getElementById(id);
      highlightedtag.classList.add('highlight');
    })
  }
}

function clearbutton() {
  let clearbutton = document.getElementById('clear');
  if (clearbutton) {
    clearbutton.classList.add('highlight');
  } else {
    let clear = document.createElement('div');
    clear.classList.add('tag', 'highlight');
    clear.id = 'clear';
    clear.innerText = 'Clear x';
    clear.addEventListener('click', () => {
      selectgenre = [];
      setgenre();
      getMovies(API_URL);
    })
    tagsEl.append(clear);
  }

}

getMovies(API_URL)
 
function getMovies(url) {
  fetch(url).then(res => res.json()).then(data => {
    if (data.results.length != 0) {
      showMovies(data.results);
    } else {
      main.innerHTML = `<h1 class ='noresults'> No Results Were Found :( </h1>`
    } 
  })
}

function showMovies(data) {
  main.innerHTML = '';

  data.forEach(movie => {
    const {title, poster_path, vote_average, overview} = movie;
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
      <img src = "${poster_path? IMG_URL+poster_path: "../searchpage/assets/images/movieplaceholder.png"}" 
      alt = "${title}">

      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average}</span>
      </div>

      <div class="overview">
        <h3>Overview</h3>
        ${overview}
      </div>

    `  
    main.appendChild(movieEl);
  })
}

function getColor(vote) {
  if (vote >= 8) {
    return 'green'
  } else if(vote >= 5){
    return 'orange'
  } else {
    return 'red'
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const searchterm = search.value;
  selectgenre = [];
  genreHighlight();
  if (searchterm){
    getMovies(searchURL+'&query='+searchterm);
  }
})

function hidebutton() {
  var x = document.getElementById("tags");
  if (x.style.display === "none") {
    x.style.display = "flex";
    // x.style.transition = "visibility 0s, opacity 0.5s linear";
  } else {
    x.style.display = "none";
  }
}

// let scrollHeight = Math.max(
//   document.body.scrollHeight, document.documentElement.scrollHeight,
//   document.body.offsetHeight, document.documentElement.offsetHeight,
//   document.body.clientHeight, document.documentElement.clientHeight
// ) + 120;
