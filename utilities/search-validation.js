const { query, validationResult } = require("express-validator");
const utilities = require(".");
const validate = {}

validate.searchRules = () => {
    return [
        // search term cannot be empty
        query("search")
            .trim()
            .escape()
            .notEmpty().withMessage("Search cannot be empty.")
            .isLength({min: 1})
            .withMessage("Search term must be at least 1 character."),
        ]
}

validate.checkSearchTerm = async (req, res, next) => {
    const { search } = req.query;  
    let builtResults;
    let errors = [];
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav();
      res.render("search/search-results", {
        errors,
        title: "Invalid Search Term",
        nav,
        search,
        builtResults,
      });
      return;
    }
    next();
  };

module.exports = validate;