function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
}
  
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
       }
    }
  }
}

const TMDB_API_KEY = 'api_key=aeb85d16b333a4e890b3632d147b264f';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TOP10_WEEKLY_URL = `${TMDB_BASE_URL}/trending/movie/week?${TMDB_API_KEY}`;
const UPCOMING_URL = `${TMDB_BASE_URL}/movie/upcoming?${TMDB_API_KEY}`;

function getWeekRangeLabel() {
  const now = new Date();
  const day = now.getDay(); // 0-6, Sunday-Saturday
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const format = (d) => `${d.getMonth() + 1}/${d.getDate()}/${String(d.getFullYear()).slice(-2)}`;
  return `${format(monday)} - ${format(sunday)}`;
}

function populateWeeklyHighlights(movies) {
  const titleEl = document.getElementById('weekly-date-title');
  const subtitleEl = document.getElementById('weekly-subtitle');
  const descriptionEl = document.getElementById('weekly-description');
  if (!titleEl || !subtitleEl || !descriptionEl) return;

  titleEl.innerText = `The week of ${getWeekRangeLabel()}`;

  const first = movies[0];
  const second = movies[1];

  if (!first) {
    subtitleEl.innerText = 'Unable to load this week\'s highlights right now.';
    descriptionEl.innerText = 'Please check back soon.';
    return;
  }

  if (second) {
    subtitleEl.innerText = `This week we are spotlighting "${first.title}" and "${second.title}".`;
    descriptionEl.innerHTML = `
      <strong>${first.title}:</strong> ${first.overview || 'No overview available.'}<br><br>
      <strong>${second.title}:</strong> ${second.overview || 'No overview available.'}
    `;
  } else {
    subtitleEl.innerText = `This week we are spotlighting "${first.title}".`;
    descriptionEl.innerHTML = `<strong>${first.title}:</strong> ${first.overview || 'No overview available.'}`;
  }
}

function populateTop10WeeklyMovies(movies) {
  const listEl = document.getElementById('top10-weekly-list');
  if (!listEl) return;

  if (!movies || movies.length === 0) {
    listEl.innerHTML = '<li>Unable to load weekly top movies right now.</li>';
    return;
  }

  listEl.innerHTML = movies
    .slice(0, 10)
    .map((movie) => `<li>${movie.title || 'Untitled Movie'}</li>`)
    .join('');
}

function populateUpcomingHighlights(movies) {
  const subtitleEl = document.getElementById('upcoming-subtitle');
  const descriptionEl = document.getElementById('upcoming-description');
  if (!subtitleEl || !descriptionEl) return;

  if (!movies || movies.length === 0) {
    subtitleEl.innerText = 'Unable to load upcoming highlights right now.';
    descriptionEl.innerText = 'Please check back soon.';
    return;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureUpcoming = movies
    .filter((movie) => {
      if (!movie.release_date) return false;
      const releaseDate = new Date(movie.release_date);
      return !Number.isNaN(releaseDate.getTime()) && releaseDate >= today;
    })
    .sort((a, b) => new Date(a.release_date) - new Date(b.release_date));

  const topUpcoming = futureUpcoming.slice(0, 3);

  if (topUpcoming.length === 0) {
    subtitleEl.innerText = 'Unable to load upcoming highlights right now.';
    descriptionEl.innerText = 'Please check back soon.';
    return;
  }

  subtitleEl.innerText = 'Upcoming movies to watch for this week:';
  descriptionEl.innerHTML = topUpcoming
    .map((movie) => {
      const date = movie.release_date ? ` (Releases ${movie.release_date})` : '';
      return `<strong>${movie.title || 'Untitled Movie'}</strong>${date}: ${movie.overview || 'No overview available.'}`;
    })
    .join('<br><br>');
}

async function populateWeeklyContent() {
  const listEl = document.getElementById('top10-weekly-list');
  if (listEl) {
    listEl.innerHTML = '<li>Loading weekly top 10...</li>';
  }

  try {
    const response = await fetch(TOP10_WEEKLY_URL);
    if (!response.ok) {
      throw new Error(`TMDB request failed: ${response.status}`);
    }
    const data = await response.json();
    const weeklyMovies = data.results || [];

    populateTop10WeeklyMovies(weeklyMovies);
    populateWeeklyHighlights(weeklyMovies);
  } catch (error) {
    populateTop10WeeklyMovies([]);
    populateWeeklyHighlights([]);
  }
}

async function populateUpcomingContent() {
  try {
    const response = await fetch(UPCOMING_URL);
    if (!response.ok) {
      throw new Error(`TMDB request failed: ${response.status}`);
    }
    const data = await response.json();
    populateUpcomingHighlights(data.results || []);
  } catch (error) {
    populateUpcomingHighlights([]);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  populateWeeklyContent();
  populateUpcomingContent();
});
