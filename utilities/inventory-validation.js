const utilities = require(".");
const invModel = require("../models/inventory-model");
const { body, validationResult } = require("express-validator");
const validate = {}


validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .isAlpha()
            .matches(/^\S+$/)
            .withMessage("Please enter a valid car classification")
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const {classification_name} = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add new classification", 
            nav,
        })
        return
    }
    next()
}

//Declare new inventory validation list 
validate.inventoryRules = () => {
    return [
        body("classification_id")
            .notEmpty()
            .withMessage("Please select valid class."),
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please enter valid make."),
        body("inv_model")
        .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please enter valid model."),
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .isNumeric()
            .isLength({min: 1, max: 4})
            .withMessage("Please enter valid year."),
        body("inv_description")
        .trim()
            .escape()
            .notEmpty()
            .isLength({min: 4})
            .withMessage("Please enter valid description."),
        body("inv_image")
            .trim()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please enter valid image path."),
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please enter valid image path."),
            body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .isNumeric()
            .withMessage("Please enter valid price."),
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .isNumeric()
            .withMessage("Please enter valid miles."),
        body("inv_color")
        .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please enter valid color."),
    ]
}

//Check inventory submission against submission rules
validate.checkInventoryData = async (req, res, next) => {
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id);
        res.render("inventory/add-inventory", {
            errors,
            title: "Add new inventory", 
            nav,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price, 
            inv_miles,
            inv_color,
            classificationList,
        })
        return
    }
    next()
}

//Check inventory EDIT against submission rules
validate.checkUpdateData = async (req, res, next) => {
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id} = req.body;
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(classification_id);
        const name = `${inv_make} ${inv_model}`
        res.render("inventory/edit-inventory", {
            errors,
            title: `Edit ${name}`, 
            nav,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price, 
            inv_miles,
            inv_color,
            classificationList,
        })
        return
    }
    next()
}


module.exports = validate;