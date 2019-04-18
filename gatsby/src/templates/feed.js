import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';

const ImageWrapper = styled.div`
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const FilmLi = styled.li`
	margin: 20px 0;
`;

const images = [];

for (let i = 1; i < 12; i++) {
	images.push(
		<ImageWrapper>
			<img width="100%" alt="" src={`${require('../ccpres/'+ i +'.jpg')}`} />
		</ImageWrapper>
	)
}

export default ({ pageContext: { films } }) => (
	<div>
		{images}
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
