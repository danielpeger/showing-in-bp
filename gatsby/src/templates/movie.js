import React from "react";

export default ({ pageContext: { movie } }) => (
  <main>
    <img src={movie.image} alt={`${movie.title} poster`} />
    <h1>{movie.title}</h1>
    <div>{movie.release}</div>
  </main>
);
