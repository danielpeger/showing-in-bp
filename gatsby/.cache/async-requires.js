// prefer default export if available
const preferDefault = m => m && m.default || m

exports.components = {
  "component---src-templates-all-pokemon-js": () => import("/Users/danielpeger/src/showing-in-bp/gatsby/src/templates/all-pokemon.js" /* webpackChunkName: "component---src-templates-all-pokemon-js" */),
  "component---cache-dev-404-page-js": () => import("/Users/danielpeger/src/showing-in-bp/gatsby/.cache/dev-404-page.js" /* webpackChunkName: "component---cache-dev-404-page-js" */)
}

exports.data = () => import(/* webpackChunkName: "pages-manifest" */ "/Users/danielpeger/src/showing-in-bp/gatsby/.cache/data.json")

