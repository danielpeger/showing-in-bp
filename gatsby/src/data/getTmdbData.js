const tmdbApiKey = '4b16b5a9a0f5ff8dcbe7170c12fca839';
const tmdbImageUrl = 'https://image.tmdb.org/t/p/w500';

exports.getTmdbData = film => {
	//Get Tmdb ID based on title
	const year = new Date(film.releaseDate).getFullYear();
	const ogTitleSearchUrl =
		'https://api.themoviedb.org/3/search/movie?api_key=' +
		tmdbApiKey +
		'&query=' +
		encodeURI(film.title);
	const hunTitleSearchUrl =
		'https://api.themoviedb.org/3/search/movie?api_key=' +
		tmdbApiKey +
		'&query=' +
		encodeURI(film.hungarianTitle);
	let ogIDResults = [];
	let hunIDResults = [];

	await axios
		.get(ogTitleSearchUrl)
		.then(function(searchResponse) {
			const results = searchResponse.data.results;
			ogIDResults = results.map(result => {
				return result.ID;
			});
		})
		.catch(function(error) {
			console.log(error);
		});

	await axios
		.get(hunTitleSearchUrl)
		.then(function(searchResponse) {
			const results = searchResponse.data.results;
			hunIDResults = results.map(result => {
				return result.ID;
			});
		})
		.catch(function(error) {
			console.log(error);
		});

	const match = ogIDResults.filter(value => hunIDResults.includes(value))[0];
	film.tmdbID = match || ogIDResults[0] || hunIDResults[0];
}
