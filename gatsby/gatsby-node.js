const puppeteer = require('puppeteer');

function noescape (string) {
	return string
}

(async () => {
  const browser = await puppeteer.launch();
  const listPage = await browser.newPage();

  await listPage.goto('http://est.hu/mozi/filmek_a_heten/#varos=298');

  const result = await listPage.evaluate(() => {
		let res = [];
		const egyseg = document.querySelectorAll('.egyseg');
		for (let i = 0; i < egyseg.length; i++) {
			let film = {};
			let titleAndYear = egyseg[i].querySelector('small').textContent;
			film.hungarianTitle = egyseg[i].querySelector('a').textContent;
			if (titleAndYear.includes(',')) {
				film.title = titleAndYear.substring(1, titleAndYear.indexOf(','));
			} else {
				film.title = film.hungarianTitle;
			};
			res.push(film);
		}
		return res;
  });

	console.log(result);

  browser.close();
})();

const movies = [
  {
    title: "Action Jackson",
    description:
      "Vengence drives a tough Detroit cop to stay on the trail of a power hungry auto magnate who's systematically eliminating his competition.",
    director: "Craig R. Baxley",
    duration: "P1H36M",
    genre: ["Action", "Comedy", "Crime"],
    image:
      "https://m.media-amazon.com/images/M/MV5BZWFhNmI3OWQtOTU5Zi00ODA3LWExNjctMTllZWE2ZGE3ZTA1XkEyXkFqcGdeQXVyNzc5MjA3OA@@._V1_SY1000_CR0,0,653,1000_AL_.jpg",
    release: "1988-02-12",
    imdbRating: 5.3,
    metaScore: 36,
    tomatoMeter: 9,
    screening: [
      {
        startDate: "2019-03-25T11:40:00+01:00",
        location: "Cinema City Westend",
        ticketUrl:
          "https://sr3.cinemacity.hu/S_HU_1137/BookingType.aspx?dtticks=636890614948865072&ec=242995&key=HUWestendP2_RES&languageId=12&token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MCwiZXhwIjoxNTUzNDYxNjk0LCJ1IjowLCJFQyI6IjI0Mjk5NSJ9.AkjtHSXzssPKxza9bdJQNL_5uf8p390xHR6Rq6VM4uA",
				dubbed: true
      },
      {
        startDate: "2019-03-25T14:20:00+01:00",
        location: "Cinema City Westend",
        ticketUrl:
          "https://sr3.cinemacity.hu/S_HU_1137/BookingType.aspx?dtticks=636890614948865072&ec=242995&key=HUWestendP2_RES&languageId=12&token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MCwiZXhwIjoxNTUzNDYxNjk0LCJ1IjowLCJFQyI6IjI0Mjk5NSJ9.AkjtHSXzssPKxza9bdJQNL_5uf8p390xHR6Rq6VM4uA",
				dubbed: false
      },
      {
        startDate: "2019-03-25T17:00:00+01:00",
        location: "Cinema City Westend",
        ticketUrl:
          "https://sr3.cinemacity.hu/S_HU_1137/BookingType.aspx?dtticks=636890614948865072&ec=242995&key=HUWestendP2_RES&languageId=12&token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MCwiZXhwIjoxNTUzNDYxNjk0LCJ1IjowLCJFQyI6IjI0Mjk5NSJ9.AkjtHSXzssPKxza9bdJQNL_5uf8p390xHR6Rq6VM4uA",
				dubbed: false
      },
      {
        startDate: "2019-03-26T20:10:00+01:00",
        location: "Cinema City Westend",
        ticketUrl:
          "https://sr3.cinemacity.hu/S_HU_1137/BookingType.aspx?dtticks=636890614948865072&ec=242995&key=HUWestendP2_RES&languageId=12&token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MCwiZXhwIjoxNTUzNDYxNjk0LCJ1IjowLCJFQyI6IjI0Mjk5NSJ9.AkjtHSXzssPKxza9bdJQNL_5uf8p390xHR6Rq6VM4uA",
				dubbed: false
      },
      {
        startDate: "2019-03-25T22:00:00+01:00",
        location: "Cinema City Westend",
        ticketUrl:
          "https://sr3.cinemacity.hu/S_HU_1137/BookingType.aspx?dtticks=636890614948865072&ec=242995&key=HUWestendP2_RES&languageId=12&token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MCwiZXhwIjoxNTUzNDYxNjk0LCJ1IjowLCJFQyI6IjI0Mjk5NSJ9.AkjtHSXzssPKxza9bdJQNL_5uf8p390xHR6Rq6VM4uA",
				dubbed: true
      },
      {
        startDate: "2019-03-25T15:15:00+01:00",
        location: "Buda Bed Cinema",
				dubbed: true
      },
      {
        startDate: "2019-03-26T19:455:00+01:00",
        location: "Buda Bed Cinema",
				dubbed: false
      }
    ]
  },
  {
    title: "Thunder Road",
    description:
      "A police officer faces a personal meltdown following a divorce and the death of his mother.",
    director: "Jim Cummings",
    duration: "P1H32M",
    genre: ["Comedy", "Drama"],
    image:
      "https://m.media-amazon.com/images/M/MV5BMjYyNGUzMDAtNzUwNC00OWY5LWIxZGQtZjJlYWU1ODY5YjYxXkEyXkFqcGdeQXVyMjk1NzAxNg@@._V1_.jpg",
    release: "2018-10-30",
    imdbRating: 7.1,
    metaScore: 82,
    tomatoMeter: 98,
    screening: [
      {
        startDate: "2019-03-26T13:00:00+01:00",
        location: "Művész Cinema ",
        ticketUrl:
          "https://sr3.cinemacity.hu/S_HU_1137/BookingType.aspx?dtticks=636890614948865072&ec=242995&key=HUWestendP2_RES&languageId=12&token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MCwiZXhwIjoxNTUzNDYxNjk0LCJ1IjowLCJFQyI6IjI0Mjk5NSJ9.AkjtHSXzssPKxza9bdJQNL_5uf8p390xHR6Rq6VM4uA",
				dubbed: false
      },
      {
        startDate: "2019-03-27T13:00:00+01:00",
        location: "Művész Cinema ",
        ticketUrl:
          "https://sr3.cinemacity.hu/S_HU_1137/BookingType.aspx?dtticks=636890614948865072&ec=242995&key=HUWestendP2_RES&languageId=12&token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MCwiZXhwIjoxNTUzNDYxNjk0LCJ1IjowLCJFQyI6IjI0Mjk5NSJ9.AkjtHSXzssPKxza9bdJQNL_5uf8p390xHR6Rq6VM4uA",
				dubbed: false
			},
      {
        startDate: "2019-03-28T13:00:00+01:00",
        location: "Művész Cinema ",
        ticketUrl:
          "https://sr3.cinemacity.hu/S_HU_1137/BookingType.aspx?dtticks=636890614948865072&ec=242995&key=HUWestendP2_RES&languageId=12&token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MCwiZXhwIjoxNTUzNDYxNjk0LCJ1IjowLCJFQyI6IjI0Mjk5NSJ9.AkjtHSXzssPKxza9bdJQNL_5uf8p390xHR6Rq6VM4uA",
				dubbed: false
			},
      {
        startDate: "2019-03-29T13:00:00+01:00",
        location: "Művész Cinema ",
        ticketUrl:
          "https://sr3.cinemacity.hu/S_HU_1137/BookingType.aspx?dtticks=636890614948865072&ec=242995&key=HUWestendP2_RES&languageId=12&token=eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MCwiZXhwIjoxNTUzNDYxNjk0LCJ1IjowLCJFQyI6IjI0Mjk5NSJ9.AkjtHSXzssPKxza9bdJQNL_5uf8p390xHR6Rq6VM4uA",
				dubbed: false
			}
    ]
  }
];

// exports.createPages = async ({ actions: { createPage } }) => {
//   createPage({
//     path: `/`,
//     component: require.resolve("./src/templates/feed.js"),
//     context: {
//       movies
//     }
//   });
// 	{movies.map(movie => (
// 		createPage({
// 			path: `/movie/${movie.title}/`,
// 			component: require.resolve("./src/templates/movie.js"),
// 			context: {
// 				movie
// 			}
// 		})
// 	))}
// };
