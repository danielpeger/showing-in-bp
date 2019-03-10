const poke = {
	pika: {
		id: 1,
		name: "pikaccc",
	},
	chari: {
		id: 2,
		name: "chr",
	},
}

exports.createPages = async ({ actions: { createPage } }) => {
  createPage({
    path: `/`,
    component: require.resolve('./src/templates/all-pokemon.js'),
    context: { poke }
  });
};
