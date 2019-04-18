import React from 'react';

export default ({ pageContext: { film } }) => (
	<main>
		<img src={film.image} alt={`${film.title} poster`} />
		<h1>{film.title}</h1>
		<div>{film.description}</div>
		<ul>
			{film.screenings.map(screening => (
				<li>
					<div>{screening.location}</div>
					{screening.showtimes.map(showtime => (
						<span>{showtime.time}, </span>
					))}
				</li>
			))}
		</ul>
	</main>
);
