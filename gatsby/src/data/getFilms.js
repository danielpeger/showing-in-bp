const puppeteer = require('puppeteer');

exports.getFilms = async limit => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('http://est.hu/mozi/filmek_a_heten/#varos=298');
	const films = await page.evaluate(limit => {
		let result = [];
		const egysegNodes = document.querySelectorAll('.egyseg');
		const stopAt = limit || egysegNodes.length;
		for (let i = 0; i < stopAt; i++) {
			const film = {};
			const titleAndYear = egysegNodes[i].querySelector('small').textContent;
			const link = egysegNodes[i].querySelector(':scope > a');
			film.hungarianTitle = link.textContent;
			if (titleAndYear.includes(',')) {
				const comma = titleAndYear.lastIndexOf(',');
				film.title = titleAndYear.substring(1, comma);
				const year = parseInt(
					titleAndYear.substring(comma + 2, titleAndYear.length - 1)
				);
				const yearDate = new Date(year, 0, 1);
				film.releaseDate = yearDate.toISOString();
			} else {
				film.title = film.hungarianTitle;
				const year = parseInt(
					titleAndYear.substring(1, titleAndYear.length - 1)
				);
				const yearDate = new Date(year, 0, 1);
				film.releaseDate = yearDate.toISOString();
			}
			const estUrl = link.getAttribute('href');
			const estIdString = estUrl.substring(
				estUrl.indexOf('=') + 1,
				estUrl.length
			);
			film.estId = parseInt(estIdString);
			if (!film.title.endsWith('3D')) {
				result = [...result, film];
			}
		}
		return result;
	}, limit);
	return films;
};
