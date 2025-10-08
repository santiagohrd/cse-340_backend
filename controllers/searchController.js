const searchModel = require("../models/search-model")
const utilities = require("../utilities/");


//Controller to manage searchResults
async function searchResults(req, res) {
    let nav = await utilities.getNav();

    const searchTerm = req.query.search;
    const results = await searchModel.searchInventory(searchTerm);
    const builtResults = await utilities.buildSearchResultsHTML(results);

    res.render(
        "search/search-results", {
            title: `Search Results for "${searchTerm}"`,
            nav,
            errors: null,
            builtResults,
        }
    )
}

module.exports = { searchResults }