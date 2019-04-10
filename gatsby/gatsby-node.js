const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const MinutesToDuration = require("./utils.js").MinutesToDuration;

async function getData() {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.goto("http://est.hu/mozi/filmek_a_heten/#varos=298");
  const listResult = await page.evaluate(() => {
    let res = [];
    const egyseg = document.querySelectorAll(".egyseg");
    for (let i = 0; i < egyseg.length; i++) {
      let film = {};
      let titleAndYear = egyseg[i].querySelector("small").textContent;
      let link = egyseg[i].querySelector(":scope > a");
      film.hungarianTitle = link.textContent;
      if (titleAndYear.includes(",")) {
        const comma = titleAndYear.lastIndexOf(",");
        film.title = titleAndYear.substring(1, comma);
        const year = parseInt(
          titleAndYear.substring(comma + 2, titleAndYear.length - 1)
        );
        const yearDate = new Date(year, 0, 1);
        film.year = yearDate.toISOString();
      } else {
        film.title = film.hungarianTitle;
        const year = parseInt(
          titleAndYear.substring(1, titleAndYear.length - 1)
        );
        const yearDate = new Date(year, 0, 1);
        film.year = yearDate.toISOString();
      }
      const estUrl = link.getAttribute("href");
      const estIdString = estUrl.substring(
        estUrl.indexOf("=") + 1,
        estUrl.length
      );
      film.estId = parseInt(estIdString);
      if (!film.title.endsWith("3D")) {
        res.push(film);
      }
    }
    return res;
  });

  //Get more data about each film
  const tmdbApiKey = "4b16b5a9a0f5ff8dcbe7170c12fca839";
  for (let i = 0; i < 3; i++) {
    const film = listResult[i];

    //Search tmdb
    if (film.title) {
      const tmdbSearchUrl =
        "https://api.themoviedb.org/3/search/movie?api_key=" +
        tmdbApiKey +
        "&language=en-US&query=" +
        encodeURI(film.title) +
        "&year=" +
        film.year;
      const tmdbImageUrl = "https://image.tmdb.org/t/p/w500";

      await axios
        .get(tmdbSearchUrl)
        .then(function(searchResponse) {
          const tmdbResult = searchResponse.data.results[0];
          if (tmdbResult) {
            film.description = tmdbResult.overview;
            film.image = tmdbImageUrl + tmdbResult.poster_path;
            film.tmdbId = tmdbResult.id;
          }
          console.log("Got tmdb search response for " + film.title);
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    //Get detailed tmdb data
    if (film.tmdbId) {
      const tmdbMovieUrl =
        "https://api.themoviedb.org/3/movie/" +
        film.tmdbId +
        "?api_key=" +
        tmdbApiKey +
        "&append_to_response=release_dates,credits";
      await axios
        .get(tmdbMovieUrl)
        .then(function(movieResponse) {
          const tmdbDetails = movieResponse.data;
          film.runtime = MinutesToDuration(tmdbDetails.runtime);
          film.imdbId = tmdbDetails.imdb_id;
          film.genres = tmdbDetails.genres.map(genre => {
            return genre.name;
          });
          const directorObject = tmdbDetails.credits.crew.find(function(
            credit
          ) {
            return credit.job == "Director";
          });
          if (directorObject) {
            film.director = directorObject.name;
          }
					//TODO: fix relese dates, get hungarian release dat properly
          const releaseDateObject = tmdbDetails.release_dates.results.find(
            function(releaseDate) {
              return releaseDate.iso_3166_1 == "HU";
            }
          );
          if (releaseDateObject) {
            film.releaseDate = releaseDateObject.release_dates[0].release_date;
          }
          console.log("Got tmdb movie details response for " + film.title);
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    //Get imdb data
    if (film.imdbId) {
      const omdbUrl =
        "http://www.omdbapi.com/?apikey=6b2763ed&i=" + film.imdbId;
      await axios
        .get(omdbUrl)
        .then(function(omdbResponse) {
          film.imdbRating = parseFloat(omdbResponse.data.imdbRating);
          film.imdbVotes = parseInt(
            omdbResponse.data.imdbVotes.replace(/,/g, "")
          );
          film.metascore = parseInt(omdbResponse.data.Metascore);
          film.description = omdbResponse.data.Plot;
          film.writer = omdbResponse.data.Writer;
          console.log("Got omdb response for " + film.title);
        })
        .catch(function(error) {
          console.log(error);
        });
    }

    //Get screenings
    const filmpage = await browser.newPage();
    const d = new Date();
    var options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const todayString = d
      .toLocaleDateString("hu-HU", options)
      .replace(new RegExp("-", "g"), ".");
    await filmpage.goto(
      "http://est.hu/mozi/filmek_a_heten/#filmkereso/film=" +
        film.estId +
        "/varos=298/dt=" +
        todayString
    );
    const screeningResult = await filmpage.evaluate(() => {
      let res = [];
      const row = document.querySelectorAll("tr[class]");
      for (let i = 0; i < row.length; i++) {
        let screening = {};
        screening.location = row[i].querySelector(".fo_cella a").textContent;
        const cells = row[i].querySelectorAll("td > div");
        screening.showtimes = [];
        for (var j = 0; j < cells.length; j++) {
          let showtime = {};
          let cellText = cells[j].textContent;

          let hours = cellText.substring(0, cellText.indexOf(":"));
          let minutes = cellText.substring(
            cellText.indexOf(":") + 1,
            cellText.indexOf("(")
          );
          let showtimeDate = new Date();
          showtimeDate.setHours(hours);
          showtimeDate.setMinutes(minutes);
          showtime.time = showtimeDate.toISOString();

          let dubString = cellText.substring(
            cellText.indexOf("(") + 1,
            cellText.length - 1
          );
          if ((dubString = "mb")) {
            showtime.dubbed = true;
            showtime.subtitled = false;
          } else if ((dubString = "f")) {
            showtime.dubbed = false;
            showtime.subtitled = true;
            showtime.subtitleLanguage = "hungarian";
          } else if ((dubString = "ensub")) {
            showtime.dubbed = false;
            showtime.subtitled = true;
            showtime.subtitleLanguage = "english";
          } else {
            showtime.dubbed = dubString;
          }

          screening.showtimes.push(showtime);
        }
        res.push(screening);
      }
      return res;
    });

    if (screeningResult) {
      film.screenings = screeningResult;
      console.log("Got screenings for " + film.title);
    }
  }

  browser.close();

  // Sort by imdb rating
  const filmsSorted = listResult.sort(function(a, b) {
    return a.imdbRating - b.imdbRating;
  });

  fs.writeFile("data.json", JSON.stringify(filmsSorted), "utf8", function(err) {
    if (err) {
      console.log("An error occured while writing JSON Object to File.");
      return console.log(err);
    }
    console.log("JSON file has been saved.");
  });

  return filmsSorted;
}

getData();

exports.createPages = async ({ actions: { createPage } }) => {
  const films = await getData();
  createPage({
    path: `/`,
    component: require.resolve("./src/templates/feed.js"),
    context: {
      films
    }
  });
  {
    films.map(film =>
      createPage({
        path: `/film/${film.title}/`,
        component: require.resolve("./src/templates/film.js"),
        context: {
          film
        }
      })
    );
  }
};
