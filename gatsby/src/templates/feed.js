import React from "react";
import { Link } from "gatsby";

export default ({ pageContext: { films } }) => (
  <ol>
    {films.map(film => (
      <li>
        <Link to={`/film/${film.title}`}>{film.title}</Link>
        <div>{film.description}</div>
        <div>Imdb: {film.imdbRating}</div>
        <div>Metacritic: {film.metaScore}</div>
        <div>Rotten Tomatoes: {film.tomatoMeter}</div>
      </li>
    ))}
  </ol>
);
