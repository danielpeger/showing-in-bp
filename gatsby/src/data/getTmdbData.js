const fetch = require('node-fetch');

const tmdbApiKey = '4b16b5a9a0f5ff8dcbe7170c12fca839';
const tmdbMovieUrl = 'https://api.themoviedb.org/3/search/movie';
const tmdbImageUrl = 'https://image.tmdb.org/t/p/w500';

exports.getTmdbData = film => {
	async function getID(title, releaseDate) {
		const year = new Date(releaseDate).getFullYear();
		const searchUrl = `${tmdbMovieUrl}?api_key=${tmdbApiKey}&query=${encodeURI(title)}&year=${year}`;
		const response = await fetch(searchUrl);
		const json = await response.json();
		return json.results.map(result => result.id);
	}

	const ogTitleIDs = getID(film.title, film.releaseDate);
	const hungarianTitleIDs = getID(film.hungarianTitle, film.releaseDate);

	const match = Object.entries(ogTitleIDs).filter(value => Object.entries(hungarianTitleIDs).includes(value))[0];
	film.tmdbID = match || ogIDResults[0] || hunIDResults[0];
	return film;
}
