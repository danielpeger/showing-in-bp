import React from 'react';

export default ({ pageContext: { film } }) => (
	<main>
		<img src={film.image} alt={`${film.title} poster`} />
		<h1>{film.title}</h1>
		<div>{film.description}</div>
		<h2>Showtimes today</h2>
		<ul>
			{film.screenings.map(screening => (
				<li>
					<div>{screening.location}</div>
					{screening.showtimes.map(showtime => (
						<span>{new Date(showtime.time).getHours()}:{new Date(showtime.time).getMinutes()}, </span>
					))}
				</li>
			))}
		</ul>
	</main>
);
