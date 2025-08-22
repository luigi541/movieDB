document.addEventListener("DOMContentLoaded", fetchMovie);

const navTitle = document.getElementById("navTitle");
navTitle.addEventListener("click", navigateHome);

function navigateHome() {
  const newLocation = "/movieDataBase.html";
  window.location.href = newLocation;
}

function getIdFromUrl() {
  const currentUrl = window.location.href;
  console.log("Full URL:", window.location.href);

  // Log the query string part of the URL
  console.log("Query String:", window.location.search);
  // Create a URLSearchParams object from the current URL
  const urlSearchParams = new URLSearchParams(currentUrl);

  // Log all search parameters
  console.log("All Parameters:");
  let movieId = "";
  urlSearchParams.forEach((value, key) => {
    movieId = value;
  });
  return movieId;
}

/**
         * <div class="imageContainer">
                        Image

                        <div class="titleContainer">
                            <h1>Spider-man return home quick!</h1>
                        </div>
                    </div>
            <div class="infoContainer">
                <div class="category">
                    <span class="categoryTitle">Date</span>
                    <p class="categoryValue">19/07/2023</p>
                </div>
                <div class="category">
                    <span class="categoryTitle">Popularity</span>
                    <p class="categoryValue">85%</p>
                </div>
                <div class="category">
                    <span class="categoryTitle">welele</span>
                    <p class="categoryValue">.l.</p>
                </div>
            </div>
 * 
 * @param {*} movie 
 */

function populatePage(movie) {
  const container = document.getElementById("container");

  const imageContainer = document.createElement("div");
  imageContainer.classList.add("imageContainer");

  const imageElement = document.createElement("img");
  imageElement.classList.add("image");
  imageElement.src = `https://www.themoviedb.org/t/p/w440_and_h660_face${movie.poster_path}`;

  imageContainer.appendChild(imageElement);

  const titleContainer = document.createElement("div");
  titleContainer.classList.add("titleContainer");

  const titleElement = document.createElement("h1");
  titleElement.innerHTML = movie.original_title;

  titleContainer.appendChild(titleElement);

  imageContainer.appendChild(titleContainer);

  const infoContainer = document.createElement("div");
  infoContainer.classList.add("infoContainer");

  const dateCategory = document.createElement("div");
  dateCategory.classList.add("category");

  const dateCategoryTitle = document.createElement("span");
  dateCategoryTitle.classList.add("categoryTitle");
  dateCategoryTitle.innerHTML = "Release date";

  const dateCategoryValue = document.createElement("p");
  dateCategoryValue.classList.add("categoryValue");
  dateCategoryValue.innerHTML = movie.release_date;

  dateCategory.appendChild(dateCategoryTitle);
  dateCategory.appendChild(dateCategoryValue);

  const descriptions = document.createElement("div");
  descriptions.classList.add("description");

  const descriptionTitle = document.createElement("p");
  descriptionTitle.classList.add("descriptionTitle");
  descriptionTitle.innerHTML = "Overview";

  const descriptionValue = document.createElement("div");
  descriptionValue.classList.add("descriptionValue");
  descriptionValue.innerHTML = movie.overview;

  descriptions.appendChild(descriptionTitle);
  descriptions.appendChild(descriptionValue);

  const popularityCategory = document.createElement("div");
  popularityCategory.classList.add("category");

  const popularityCategoryTitle = document.createElement("span");
  popularityCategoryTitle.classList.add("categoryTitle");
  popularityCategoryTitle.innerHTML = "Rating";

  const popularityCategoryValue = document.createElement("p");
  popularityCategoryValue.classList.add("categoryValue");
  popularityCategoryValue.innerHTML = `${Math.floor(movie.vote_average * 10)}%`;

  popularityCategory.appendChild(popularityCategoryTitle);
  popularityCategory.appendChild(popularityCategoryValue);

  infoContainer.appendChild(dateCategory);
  infoContainer.appendChild(popularityCategory);
  infoContainer.appendChild(descriptions);

  container.appendChild(imageContainer);
  container.appendChild(infoContainer);
}

async function fetchMovie() {
  const movieId = getIdFromUrl();
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=02dd4e4bf4792803c07f78fb41cab31b`;

  try {
    const response = await fetch(url);

    const result = await response.json();

    populatePage(result);
  } catch {
    console.log("error");
  }
}
