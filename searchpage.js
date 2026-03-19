// new api, old api code deleted in 8/02 comment deletion

const API_KEY = 'api_key=aeb85d16b333a4e890b3632d147b264f'
const BASE_URL = 'https://api.themoviedb.org/3'
const API_URL = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const searchURL = BASE_URL + '/search/movie?' + API_KEY;

const genres = [
  {
    "id": 28,
    "name": "Action"
  },
  {
    "id": 12,
    "name": "Adventure"
  },
  {
    "id": 16,
    "name": "Animation"
  },
  {
    "id": 35,
    "name": "Comedy"
  },
  {
    "id": 80,
    "name": "Crime"
  },
  {
    "id": 99,
    "name": "Documentary"
  },
  {
    "id": 18,
    "name": "Drama"
  },
  {
    "id": 10751,
    "name": "Family"
  },
  {
    "id": 14,
    "name": "Fantasy"
  },
  {
    "id": 36,
    "name": "History"
  },
  {
    "id": 27,
    "name": "Horror"
  },
  {
    "id": 10402,
    "name": "Music"
  },
  {
    "id": 9648,
    "name": "Mystery"
  },
  {
    "id": 10749,
    "name": "Romance"
  },
  {
    "id": 878,
    "name": "Science Fiction"
  },
  {
    "id": 10770,
    "name": "TV Movie"
  },
  {
    "id": 53,
    "name": "Thriller"
  },
  {
    "id": 10752,
    "name": "War"
  },
  {
    "id": 37,
    "name": "Western"
  }
];

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');
const tagsEl = document.getElementById('tags');
const sortButton = document.getElementById('sortbutton');

let selectedGenres = [];
let currentSearchTerm = '';
let currentPage = 1;
let totalPages = 1;
let isLoading = false;
let allMovies = [];
let sortMode = 'default';

setgenre();

function setgenre() {
  tagsEl.innerHTML = '';
  genres.forEach(genre => {
    const t = document.createElement('div');
    t.classList.add('tag');
    t.id = genre.id;
    t.innerText = genre.name;
    t.addEventListener('click', () => {
      if (selectedGenres.length === 0) {
        selectedGenres.push(genre.id);
      } else {
        if (selectedGenres.includes(genre.id)) {
          selectedGenres.forEach((id, idx) => {
            if (id === genre.id) {
              selectedGenres.splice(idx, 1);
            }
          });
        } else {
          selectedGenres.push(genre.id);
        }
      }
      genreHighlight();
      reloadMovies();
    });
    tagsEl.append(t);
  });
}

function genreHighlight() {
  const tags = document.querySelectorAll('.tag');
  tags.forEach(tag => {
    tag.classList.remove('highlight');
  });
  clearbutton();
  if (selectedGenres.length !== 0) {
    selectedGenres.forEach(id => {
      const highlightedtag = document.getElementById(id);
      highlightedtag.classList.add('highlight');
    });
  }
}

function clearbutton() {
  const existingClear = document.getElementById('clear');
  if (selectedGenres.length === 0) {
    if (existingClear) existingClear.remove();
    return;
  }

  if (!existingClear) {
    let clear = document.createElement('div');
    clear.classList.add('tag', 'highlight');
    clear.id = 'clear';
    clear.innerText = 'Clear x';
    clear.addEventListener('click', () => {
      selectedGenres = [];
      setgenre();
      genreHighlight();
      reloadMovies();
    });
    tagsEl.append(clear);
  }
}

function buildUrl(page) {
  const pageParam = `&page=${page}`;
  if (currentSearchTerm) {
    return `${searchURL}&query=${encodeURIComponent(currentSearchTerm)}${pageParam}`;
  }

  if (selectedGenres.length !== 0) {
    return `${API_URL}&with_genres=${encodeURIComponent(selectedGenres.join(','))}${pageParam}`;
  }

  return `${API_URL}${pageParam}`;
}

function matchesSelectedGenres(movie) {
  if (selectedGenres.length === 0) return true;
  if (!movie.genre_ids || !Array.isArray(movie.genre_ids)) return false;
  return movie.genre_ids.some(id => selectedGenres.includes(id));
}

function updateSortButtonLabel() {
  if (!sortButton) return;
  if (sortMode === 'highest') {
    sortButton.innerText = 'Sort: Highest';
  } else if (sortMode === 'lowest') {
    sortButton.innerText = 'Sort: Lowest';
  } else {
    sortButton.innerText = 'Sort: Default';
  }
}

function getSortedMovies(movies) {
  const sorted = [...movies];
  if (sortMode === 'highest') {
    sorted.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
  } else if (sortMode === 'lowest') {
    sorted.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
  }
  return sorted;
}

function mergeMovies(movies) {
  const existingIds = new Set(allMovies.map(movie => movie.id));
  movies.forEach(movie => {
    if (!existingIds.has(movie.id)) {
      allMovies.push(movie);
      existingIds.add(movie.id);
    }
  });
}

async function fetchMovies(reset = false) {
  if (isLoading) return;
  if (!reset && currentPage > totalPages) return;

  if (reset) {
    currentPage = 1;
    totalPages = 1;
    allMovies = [];
    main.innerHTML = '';
  }

  isLoading = true;

  try {
    let pageResults = [];
    let reachedEnd = false;

    while (pageResults.length === 0 && !reachedEnd) {
      if (currentPage > totalPages) {
        reachedEnd = true;
        break;
      }

      const response = await fetch(buildUrl(currentPage));
      const data = await response.json();

      totalPages = data.total_pages || 1;
      pageResults = data.results || [];

      // TMDB search endpoint does not support with_genres, so filter client-side.
      if (currentSearchTerm && selectedGenres.length !== 0) {
        pageResults = pageResults.filter(matchesSelectedGenres);
      }

      currentPage += 1;
      if (currentPage > totalPages && pageResults.length === 0) {
        reachedEnd = true;
      }
    }

    if (pageResults.length !== 0) {
      mergeMovies(pageResults);
      renderMovies();
      return;
    }

    if (allMovies.length === 0) {
      main.innerHTML = `<h1 class='noresults'>No Results Were Found :(</h1>`;
    }
  } catch (err) {
    if (allMovies.length === 0) {
      main.innerHTML = `<h1 class='noresults'>Something went wrong loading movies.</h1>`;
    }
  } finally {
    isLoading = false;
  }
}

function renderMovies() {
  const sortedMovies = getSortedMovies(allMovies);
  main.innerHTML = '';

  if (sortedMovies.length === 0) {
    main.innerHTML = `<h1 class='noresults'>No Results Were Found :(</h1>`;
    return;
  }

  sortedMovies.forEach(movie => {
    const { title, poster_path, vote_average, overview } = movie;
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');
    movieEl.innerHTML = `
      <img src = "${poster_path ? IMG_URL + poster_path : "./images/movieplaceholder.png"}" 
      alt = "${title}">
      <div class="movie-info">
        <h3>${title}</h3>
        <span class="${getColor(vote_average)}">${vote_average}</span>
      </div>
      <div class="overview">
        <h3>Overview</h3>
        ${overview || 'No overview available.'}
      </div>
    `;
    main.appendChild(movieEl);
  });
}

function getColor(vote) {
  if (vote >= 8) {
    return 'green';
  } else if (vote >= 5) {
    return 'orange';
  } else {
    return 'red';
  }
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  currentSearchTerm = search.value.trim();
  reloadMovies();
});

if (sortButton) {
  sortButton.addEventListener('click', () => {
    if (sortMode === 'default') {
      sortMode = 'highest';
    } else if (sortMode === 'highest') {
      sortMode = 'lowest';
    } else {
      sortMode = 'default';
    }
    updateSortButtonLabel();
    renderMovies();
  });
}

window.addEventListener('scroll', () => {
  const nearBottom =
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 400;
  if (nearBottom) {
    fetchMovies(false);
  }
});

function reloadMovies() {
  fetchMovies(true);
}

function hidebutton() {
  var x = document.getElementById("tags");
  if (x.style.display === "none") {
    x.style.display = "flex";
  } else {
    x.style.display = "none";
  }
}

updateSortButtonLabel();
reloadMovies();
