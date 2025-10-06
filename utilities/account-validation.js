const utilities = require(".");
const accountModel = require("../models/account-model")
const { body, validationResult } = require("express-validator");
const validate = {}

validate.registrationRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .isLength({min: 1})
            .withMessage("Please provide a first name."),

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .isLength({min: 1})
            .withMessage("Please provide a last name."),

        //valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required")
            .custom(async (account_email) => {
                const emailExists = await accountModel.checkExistingEmail(account_email)
                if (emailExists){
                throw new Error("Email exists. Please log in or use different email")
                }
            }),

        //password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1, 
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/registration", {
            errors,
            title: "Register",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}

validate.loginRules = () => {
    return [
        //valid email is required
        body("account_email")
            .trim()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required"),

        //password is required and must be strong password
        body("account_password")
            .trim()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1, 
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}

validate.checkLoginData = async (req, res, next) => {
    const {account_email} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/login", {
            errors,
            title: "Login",
            nav,
            account_email,
        })
        return
    }
    next()
}

/* ******************************
 * Update personal details rules
 * ***************************** */
validate.updateRules = () => {
    return [
        // firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide a first name."),

        // lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({min: 1})
            .withMessage("Please provide a last name."),

        //valid email is required and cannot already exist in the DB
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid email is required")
            .custom(async (account_email, { req }) => {
                // Check if email exists after a change
                const currentAccount = await accountModel.getAccountById(req.body.account_id)

                if (!currentAccount.account_email === account_email) {
                    const emailExists = await accountModel.checkExistingEmail(account_email)
                    if (emailExists) {
                        throw new Error("Email exists. Please log in or use different email")
                    }
                }
            }),
    ]
}

validate.checkUpdatePersonalData = async (req, res, next) => {
    const {account_firstname, account_lastname, account_email, account_id} = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account Information",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id
        })
        return
    }
    next()
}

/* ******************************
 * Update password details rules
 * ***************************** */
validate.changePasswordRules = () => {
    return [
        //password is required and must be strong password
        body("account_password")
           .trim()
           .notEmpty()
           .isStrongPassword({
               minLength: 12,
               minLowercase: 1,
               minUppercase: 1, 
               minNumbers: 1,
               minSymbols: 1,
           })
           .withMessage("Password does not meet requirements.")
    ]
}

validate.checkPasswordData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("account/update", {
            errors,
            title: "Update Account Information",
            nav,
            account_firstname,
            account_lastname,
            account_email,
        })
        return
    }
    next()
}


module.exports = validate;