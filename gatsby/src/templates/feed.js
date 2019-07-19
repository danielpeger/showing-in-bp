import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

const FilmLi = styled.li`
	margin: 20px 0;
`;

export default ({ pageContext: { films } }) => (
	<div>
		<ol>
			{films.sort(function(a, b) {
					return b.aggregatedRating - a.aggregatedRating
				}).map(film => (
				<FilmLi>
					<Link to={`/film/${film.title}`}>{film.title}</Link>
					<div>{film.description}</div>
					<div>Imdb: {film.imdbRating}</div>
					<div>Metacritic: {film.metascore}</div>
					<div>aggr: {film.aggregatedRating}</div>
				</FilmLi>
			))}
		</ol>
	</div>
);
