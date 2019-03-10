import React from 'react';

export default ({ pageContext: { poke } }) => (
  <div style={{ width: 960, margin: '4rem auto' }}>
    <h1>Choose a Pokémon!</h1>
    <ul>
			{Object.keys(poke).map((keyName, i) => (
			    <li key={i}>
			        helló key: {i} Name: {poke[keyName].name}
			    </li>
			))}
    </ul>
  </div>
);
