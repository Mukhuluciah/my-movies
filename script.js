const movies = [
  {
    id: "arrival",
    title: "Arrival",
    year: 2016,
    director: "Denis Villeneuve",
    genre: "Sci-fi",
    note: "Quiet, strange, and somehow comforting.",
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=82",
    alt: "Misty mountains beneath a soft, open sky"
  },
  {
    id: "spider-verse",
    title: "Spider-Man: Into the Spider-Verse",
    year: 2018,
    director: "Bob Persichetti et al.",
    genre: "Animation",
    note: "Every frame feels like its own little universe.",
    image: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=82",
    alt: "A deep blue night sky full of stars"
  },
  {
    id: "grand-budapest",
    title: "The Grand Budapest Hotel",
    year: 2014,
    director: "Wes Anderson",
    genre: "Comedy",
    note: "A perfectly composed little escape.",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=82",
    alt: "A striking building facade with geometric lines"
  },
  {
    id: "spirited-away",
    title: "Spirited Away",
    year: 2001,
    director: "Hayao Miyazaki",
    genre: "Animation",
    note: "A world I would happily get lost in.",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=900&q=82",
    alt: "Sculptural architecture seen from below"
  },
  {
    id: "moonlight",
    title: "Moonlight",
    year: 2016,
    director: "Barry Jenkins",
    genre: "Drama",
    note: "Tender, luminous, and beautifully told.",
    image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=900&q=82",
    alt: "Blue ocean waves catching the light"
  },
  {
    id: "before-sunrise",
    title: "Before Sunrise",
    year: 1995,
    director: "Richard Linklater",
    genre: "Romance",
    note: "The kind of conversation you wish would last all night.",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=82",
    alt: "A quiet landscape in the last light of day"
  },
  {
    id: "the-matrix",
    title: "The Matrix",
    year: 1999,
    director: "The Wachowskis",
    genre: "Action",
    note: "Still makes reality feel a little suspicious.",
    image: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=82",
    alt: "City buildings rising into a hazy sky"
  },
  {
    id: "little-women",
    title: "Little Women",
    year: 2019,
    director: "Greta Gerwig",
    genre: "Drama",
    note: "Warm, lively, and full of people to root for.",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=82",
    alt: "Sunlight spreading across a green field"
  }
];

const movieGrid = document.querySelector("#movie-grid");
const searchInput = document.querySelector("#search-input");
const genreFilter = document.querySelector("#genre-filter");
const savedFilter = document.querySelector("#saved-filter");
const collectionCount = document.querySelector("#collection-count");
const emptyState = document.querySelector("#empty-state");
const storageKey = "cine-file-saved-movies";
let savedMovies = readSavedMovies();
let showSavedOnly = false;

function readSavedMovies() {
  try {
    return new Set(JSON.parse(localStorage.getItem(storageKey) || "[]"));
  } catch {
    return new Set();
  }
}

function saveSavedMovies() {
  try {
    localStorage.setItem(storageKey, JSON.stringify([...savedMovies]));
  } catch {
    return;
  }
}

function addGenreOptions() {
  const genres = [...new Set(movies.map((movie) => movie.genre))].sort();

  for (const genre of genres) {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreFilter.append(option);
  }
}

function getVisibleMovies() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedGenre = genreFilter.value;

  return movies.filter((movie) => {
    const matchesSearch = `${movie.title} ${movie.director} ${movie.genre}`.toLowerCase().includes(searchTerm);
    const matchesGenre = selectedGenre === "all" || movie.genre === selectedGenre;
    const matchesSaved = !showSavedOnly || savedMovies.has(movie.id);
    return matchesSearch && matchesGenre && matchesSaved;
  });
}

function createMovieCard(movie, index) {
  const isSaved = savedMovies.has(movie.id);
  const card = document.createElement("article");
  card.className = "movie-card";
  card.style.animationDelay = `${index * 35}ms`;
  card.innerHTML = `
    <div class="poster">
      <img src="${movie.image}" alt="${movie.alt}" loading="lazy" />
      <span class="poster-number">${String(index + 1).padStart(2, "0")}</span>
      <button class="save-button" type="button" data-movie-id="${movie.id}" aria-pressed="${isSaved}" aria-label="${isSaved ? "Remove" : "Save"} ${movie.title}">
        ${isSaved ? "SAVED" : "SAVE"}
      </button>
      <span class="poster-genre">${movie.genre}</span>
    </div>
    <div class="movie-info">
      <h3>${movie.title}</h3>
      <p class="movie-meta">${movie.year} <span aria-hidden="true">/</span> ${movie.director}</p>
      <p class="movie-note">${movie.note}</p>
    </div>
  `;
  return card;
}

function renderMovies() {
  const visibleMovies = getVisibleMovies();
  movieGrid.replaceChildren(...visibleMovies.map(createMovieCard));
  collectionCount.textContent = `${visibleMovies.length} ${visibleMovies.length === 1 ? "FILM" : "FILMS"}`;
  emptyState.hidden = visibleMovies.length > 0;
}

movieGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-movie-id]");
  if (!button) return;

  const movieId = button.dataset.movieId;
  if (savedMovies.has(movieId)) {
    savedMovies.delete(movieId);
  } else {
    savedMovies.add(movieId);
  }

  saveSavedMovies();
  renderMovies();
});

searchInput.addEventListener("input", renderMovies);
genreFilter.addEventListener("change", renderMovies);

savedFilter.addEventListener("click", () => {
  showSavedOnly = !showSavedOnly;
  savedFilter.setAttribute("aria-pressed", String(showSavedOnly));
  savedFilter.querySelector(".saved-filter-mark").textContent = showSavedOnly ? "✓" : "+";
  renderMovies();
});

addGenreOptions();
renderMovies();