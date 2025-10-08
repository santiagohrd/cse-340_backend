const express = require("express");
const router = new express.Router();
const searchController = require("../controllers/searchController")
const utilities = require("../utilities");
const searchValidate = require("../utilities/search-validation")

router.get("/", 
    searchValidate.searchRules(),
    searchValidate.checkSearchTerm,
    utilities.handleErrors(searchController.searchResults));

module.exports = router;