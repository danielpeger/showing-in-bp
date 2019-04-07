const puppeteer = require("puppeteer");

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
      } else {
        film.title = film.hungarianTitle;
      }
      let estUrl = link.getAttribute("href");
      film.estId = estUrl.substring(estUrl.indexOf("=") + 1, estUrl.length);
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
				screening.times = [];
				for (var j = 0; j < cells.length; j++) {
					screening.time.push(cells[j].textContent);
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

//document.querySelectorAll('.talalat_tabla td div')
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
