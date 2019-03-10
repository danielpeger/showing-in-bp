const { hot } = require("react-hot-loader/root")

// prefer default export if available
const preferDefault = m => m && m.default || m


exports.components = {
  "component---src-templates-all-pokemon-js": hot(preferDefault(require("/Users/danielpeger/src/showing-in-bp/gatsby/src/templates/all-pokemon.js"))),
  "component---cache-dev-404-page-js": hot(preferDefault(require("/Users/danielpeger/src/showing-in-bp/gatsby/.cache/dev-404-page.js")))
}

