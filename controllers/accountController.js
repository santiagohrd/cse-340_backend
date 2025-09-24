const utilities = require("../utilities") 
const accountModel = require("../models/account-model")


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistration(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/registration", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}
module.exports = { buildLogin, buildRegistration }

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res, next) {
    let nav = await utilities.getNav();
    const {account_firstname, account_lastname, account_email, account_password} = req.body;

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash(
            "error",
            `Sorry, the registration failed. Please try again.`
        )
        res.status(501).render("account/register", {
            title: "Register",
            nav,
        })
    }
}

module.exports = { buildLogin, buildRegistration, registerAccount }