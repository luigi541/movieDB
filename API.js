/**
 * VARIABLES
 */
let page = 1;
let totalPages = 0;

/**
 * ELEMENTS
 */

const navTitle = document.getElementById("navTitle");
const searchBtn = document.getElementById("search-button");
const searchInput = document.getElementById("search-input");
const toastBtn = document.getElementById("toastBtn");

/**
 * EVENT LISTENERS
 */

document.addEventListener("DOMContentLoaded", fetchPopularMovies);
document.addEventListener("DOMContentLoaded", handlePagination);

navTitle.addEventListener("click", resetPagination);

toastBtn.addEventListener("click", hideToast);

searchBtn.addEventListener("click", searchMovies);

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchMovies();
  }
});

/**
 * Function responsible for reset the pagination and call the populate movies fetch function
 */
function resetPagination() {
  page = 1;
  totalPages = 0;
  fetchPopularMovies();
}

/**
 * Function responsible to clear the grid movie items from the page
 */
function clearGrid() {
  const cards = document.querySelectorAll(".album");
  cards.forEach((card) => {
    card.parentNode.removeChild(card);
  });
}

/**
 * Function responsible to hide the error toast from the page
 */
function hideToast() {
  const toast = document.getElementById("searchToast");
  toast.classList.remove("toastVisible");
  toast.classList.add("toastHidded");
}

/**
 * displayNotFound function
 *
 * 1º - cria a html structure para o notFound
 * 2º - vai buscar o movie grid container
 * 3º - remove a class grelha da movie grid (que fazia toda o grid styling)
 * 4º - chamaos o clear grid function para apagar todos os movie cards
 * 5º - adicionamos ao movie grid container o not found html
 */
function displayNotFound() {
  const notFoundContainer = document.createElement("div");
  notFoundContainer.classList.add("notFound");
  notFoundContainer.setAttribute("id", "searchNotFound");

  const message = document.createElement("h3");
  message.innerHTML = "Nothing to show here :/";
  notFoundContainer.appendChild(message);

  const zero = document.createElement("h1");
  zero.classList.add("zero");
  zero.innerHTML = "0";
  notFoundContainer.appendChild(zero);

  const message2 = document.createElement("h3");
  message2.innerHTML = "results";
  notFoundContainer.appendChild(message2);

  const moviesContainer = document.getElementById("movie-grid");
  moviesContainer.classList.remove("grelha");

  clearGrid();

  moviesContainer.appendChild(notFoundContainer);
}

function handleMovieCardClick(movieId) {
  const newLocation = `/movieDetails.html?movie=${movieId}`;
  window.location.href = newLocation;
}

/**
 * populateMovies function
 *
 * 1º - Vai buscar o movie grid container
 * 2º - Vai buscar o not found container
 * 3º - se o not found estiver presente na pagina, removemos da pagina e voltamos
 * a adicionar a class 'grelha' responsavel pelos styles da grid
 * 4º - para cada movie vamos construir a html structure e adicionar à pagina
 *
 * @param movies - All movies to be presented in the page
 */
function populateMovies(movies) {
  const movieGridContainer = document.getElementById("movie-grid");

  // Antes de popular a grid com os movies temos que certificarmo-nos que removemos o notFound
  const notFound = document.getElementById("searchNotFound");

  if (notFound !== null) {
    notFound.parentNode.removeChild(notFound);
    movieGridContainer.classList.add("grelha");
  }

  movies.forEach((movie) => {
    // Movie card element
    const albumElement = document.createElement("div");
    albumElement.classList.add("album");

    // Movie card image element
    const imageElement = document.createElement("img");
    imageElement.classList.add("movieImage");
    imageElement.src = `https://www.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}`;

    // Movie card info container element
    const infoContainer = document.createElement("div");
    infoContainer.classList.add("infoContainer");

    // Movie card title element
    const movieTitleElement = document.createElement("span");
    movieTitleElement.innerHTML = movie.title;
    movieTitleElement.classList.add("movieTitle");

    // Movie card date element
    const movieDateElement = document.createElement("span");
    movieDateElement.innerHTML = movie.release_date;
    movieDateElement.classList.add("movieDate");

    // TODO: ratingContainer => div [tem class]

    // Movie card rating container element
    const ratingContainer = document.createElement("div");
    ratingContainer.classList.add("ratingContainer");

    const rating = document.createElement("span");
    const ratingPercentage = Math.floor(movie.vote_average * 10);
    rating.innerHTML = `${ratingPercentage}%`;

    // adding rating inside rating container
    ratingContainer.appendChild(rating);

    // adding movie title, date and rating container inside info container
    infoContainer.appendChild(movieTitleElement);
    infoContainer.appendChild(movieDateElement);
    infoContainer.appendChild(ratingContainer);

    // adding image container and info container inside the card container
    albumElement.appendChild(imageElement);
    albumElement.appendChild(infoContainer);

    albumElement.addEventListener("click", () =>
      handleMovieCardClick(movie.id)
    );

    movieGridContainer.appendChild(albumElement);
  });
}

/**
 * Function that handles the logic when the user clicks on the previous page button
 */
function previousPageButtonClicked() {
  const buttonClicked = this;

  if (page === 1) {
    this.classList.add("disabled");
  } else {
    page--;

    if (page === 1) {
      this.classList.add("disabled");
    }

    if (page !== totalPages) {
      const nextBtn = document.getElementById("nextPageBtn");
      nextBtn.classList.remove("disabled");
    }
    fetchPopularMovies();
  }
}

/**
 * Function that handles the logic when the user clicks on the next page button
 */
function nextPageButtonClicked() {
  const buttonClicked = this;

  if (page === totalPages) {
    this.classList.add("disabled");
  } else {
    page++;

    if (page === totalPages) {
      this.classList.add("disabled");
    } else {
      this.classList.remove("disabled");
    }

    if (page > 1) {
      const previousBtn = document.getElementById("previousPageBtn");
      previousBtn.classList.remove("disabled");
    }

    fetchPopularMovies();
  }
}

/**
 * Function responsible for handling the events for the pagination buttons
 */
function handlePagination() {
  const previousBtn = document.getElementById("previousPageBtn");
  const nextBtn = document.getElementById("nextPageBtn");

  previousBtn.addEventListener("click", previousPageButtonClicked);

  nextBtn.addEventListener("click", nextPageButtonClicked);
}

/**
 * Function that fetch movies based on a search param and handle these scenarios:
 *
 * 1º - If the search query string is empty we show a error toast
 * 2º - If the results from the API came with an empty [] then we show the not found page
 * 3º - If nothing wrong happens we call the populateMovies function to show the movies on the page
 *
 * @returns -
 */
async function searchMovies() {
  const search = searchInput.value;

  searchInput.value = "";

  if (search.trim() === "") {
    const toast = document.getElementById("searchToast");
    toast.classList.remove("toastHidded");
    toast.classList.add("toastVisible");
    return;
  }

  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=02dd4e4bf4792803c07f78fb41cab31b&query=${search}`;

  try {
    const response = await fetch(searchUrl);
    //movies => javascript object {}
    const resultObject = await response.json();
    if (resultObject.results.length === 0) {
      displayNotFound();
    } else {
      clearGrid();
      populateMovies(resultObject.results);
    }
  } catch (e) {
    throw new error(e);
  }
}

/**
 * Function that fetch the populate movies from the API based on the current page
 * and call the function to populate the movies in the page
 */
async function fetchPopularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=02dd4e4bf4792803c07f78fb41cab31b&language=en-US&page=${page}`;

  try {
    const response = await fetch(url);
    //movies => javascript object {}
    const resultObject = await response.json();
    console.log("fetchPopularMovies() page => ", page);
    totalPages = resultObject.total_pages;

    clearGrid();
    populateMovies(resultObject.results);
  } catch {
    console.log("error");
  }
}
