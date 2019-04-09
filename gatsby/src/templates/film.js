import React from "react";

export default ({ pageContext: { film } }) => (
  <main>
    <img src={film.image} alt={`${film.title} poster`} />
    <h1>{film.title}</h1>
    <div>{film.description}</div>
  </main>
);
