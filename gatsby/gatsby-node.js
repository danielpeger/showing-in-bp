const puppeteer = require("puppeteer");
const axios = require("axios");

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
        film.title = titleAndYear.substring(1, titleAndYear.indexOf(","));
				const year = titleAndYear.substring(titleAndYear.indexOf(",")+2, titleAndYear.length-1);
				film.year = parseInt(year);
      } else {
        film.title = film.hungarianTitle;
				const year = titleAndYear.substring(1, titleAndYear.length-1);
				film.year = parseInt(year);
      }
      let estUrl = link.getAttribute("href");
      film.estId = estUrl.substring(estUrl.indexOf("=") + 1, estUrl.length);

			const tmdbApiKey = '4b16b5a9a0f5ff8dcbe7170c12fca839';
			const tmdbUrl = 'https://api.themoviedb.org/3/search/movie?api_key='+tmdbApiKey+'&language=en-US&query='+film.title+'&year='+film.year;
			axios.get(tmdbUrl)
			  .then(function (response) {
					film.desription = response.results[0].overview;
			  })
			  .catch(function (error) {
			    // handle error
			    console.log(error);
			  });

      res.push(film);
    }
    return res;
  });

  for (let i = 0; i < listResult.length; i++) {
    const film = listResult[i];
    const filmpage = await browser.newPage();
		const d = new Date();
		var options = { year: 'numeric', month: '2-digit', day: '2-digit' };
		const todayString = d.toLocaleDateString('hu-HU', options).replace(new RegExp('-', 'g'),'.');
    await filmpage.goto(
      'http://est.hu/mozi/filmek_a_heten/#filmkereso/film='
			+ film.estId + '/varos=298/dt=' + todayString
    );
    const screeningResult = await filmpage.evaluate(() => {
      let res = [];
      const row = document.querySelectorAll("tr[class]");
      for (let i = 0; i < row.length; i++) {
        let screening = {};
        screening.location = row[i].querySelector(".fo_cella a").textContent;
				const cells = row[i].querySelectorAll("td > div");
				screening.events = [];
				for (var j = 0; j < cells.length; j++) {
					let event = {};
					let cellText = cells[j].textContent;

					let hours = cellText.substring(0, cellText.indexOf(':'));
					let minutes = cellText.substring(cellText.indexOf(':')+1, cellText.indexOf('('));
					let eventDate = new Date();
					eventDate.setHours(hours);
					eventDate.setMinutes(minutes);
					event.time = eventDate.toISOString();

					let dubString = cellText.substring(cellText.indexOf('(')+1, cellText.length-1)
					if (dubString = 'mb') {
						event.dubbed = true;
						event.subtitled = false;
						event.subtitleLanguage = false;
					} else if (dubString = 'f') {
						event.dubbed = false;
						event.subtitled = true;
						event.subtitleLanguage = 'hungarian';
					} else if (dubString = 'ensub') {
						event.dubbed = false;
						event.subtitled = true;
						event.subtitleLanguage = 'english';
					} else {
						event.dubbed = dubString;
					}

					screening.events.push(event);
				}
        res.push(screening);
      }
      return res;
    });
    film.screenings = screeningResult;
  }

	console.log(JSON.stringify(listResult, null, 2));

  browser.close();

  return listResult;
}

getData();

exports.createPages = async ({ actions: { createPage } }) => {
  const movies = await getData();
  createPage({
    path: `/`,
    component: require.resolve("./src/templates/feed.js"),
    context: {
      movies
    }
  });
  {
    movies.map(movie =>
      createPage({
        path: `/movie/${movie.title}/`,
        component: require.resolve("./src/templates/movie.js"),
        context: {
          movie
        }
      })
    );
  }
};
