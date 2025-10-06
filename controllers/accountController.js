const utilities = require("../utilities") 
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { parse } = require("dotenv");
require("dotenv").config()

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
*  Process Registration
* *************************************** */
async function registerAccount(req, res, next) {
    let nav = await utilities.getNav();
    const {account_firstname, account_lastname, account_email, account_password} = req.body;

    //Hash password before storing
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error processing the registration.')
        res.status(500).render("account/register", {
            title: "Registration",
            nav,
            errors: null,
        })
    }

    const regResult = await accountModel.registerAccount(
        account_firstname,
        account_lastname,
        account_email,
        hashedPassword
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re registered ${account_firstname}. Please log in`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
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

/* ****************************************
 *  Deliver account management page
 * ************************************ */
async function deliverAccountManagement(req, res) {
    let nav = await utilities.getNav();
    const user = res.locals.accountData;
    console.log(user);
    res.render("account/account", {
        title: "Manage account",
        nav,
        errors: null,
        account_id: user.account_id,
        account_type: user.account_type,
        account_firstname: user.account_firstname,
    })
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
    let nav = utilities.getNav();
    const { account_email, account_password} = req.body;
    const accountData = await accountModel.getAccountByEmail(account_email);
    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again");
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000})
            if (process.env.NODE_ENV === "developement") {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 }) 
            } else {
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000})
            }
            return res.redirect("/account/")
        } else {
            req.flash("message notice", "Please check your login credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error("Access forbidden");
    }
}

/* ****************************************
 *  Deliver account update view
 * ************************************ */
async function buildAccountUpdate(req, res) {
    let nav = await utilities.getNav();
    const accountId = parseInt(req.params.accountId);
    console.log(req.params.account_id);
    const accountInfo = await accountModel.getAccountById(accountId);
    res.render("account/update", {
        title: "Update Account Information",
        nav,
        errors: null,
        account_id: accountInfo.account_id,
        account_firstname: accountInfo.account_firstname,
        account_lastname: accountInfo.account_lastname,
        account_email: accountInfo.account_email,
    })
}

/* ****************************************
 *  Process personal details update
 * ************************************ */
async function updatePersonal(req, res) {
    let nav = await utilities.getNav();
    const { account_firstname, account_lastname, account_email, account_id } = req.body;

    const updateResult = await accountModel.updatePersonal(
        account_firstname,
        account_lastname,
        account_email,
        account_id
    )

    if (updateResult) {
        const currentName = `${account_firstname} ${account_lastname}`
        const currentEmail = `${account_email}`
        req.flash("notice", `Congratulations ${currentName} with email - ${currentEmail}. Your details have been updated successfully.`)
        res.redirect("/account/")
    } else {
        req.flash(
            "error",
            `Sorry, the update failed. Please try again`
        )
        res.status(501).render("account/update", {
            title: "Update Account Information",
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
          })
    }
}

/* ****************************************
 *  Process password change update
 * ************************************ */
async function updatePassword(req, res) {
    let nav = await utilities.getNav();
    const { account_password, account_id } = req.body;

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", 'Sorry, there was an error changing your password.')
        res.status(500).render("account/update", {
            title: "Update Account Information",
            nav,
            errors: null,
        })
    }

    const updatePassword = await accountModel.updatePassword(
        hashedPassword,
        account_id
    )

    if (updatePassword) {
        req.flash("notice", `Congratulations, your password was changed successfully`)
        res.redirect("/account/")
    } else {
        req.flash(
            "error",
            `Sorry, the process failed. Please try again`
        )
        res.status(501).render("account/update", {
            title: "Update Account Information",
            nav,
            account_id,
          })
    }
}

async function logout (req, res) {
    res.clearCookie("jwt");
    res.redirect("/")
}

module.exports = { buildLogin, buildRegistration, registerAccount, accountLogin, deliverAccountManagement, buildAccountUpdate, updatePersonal, updatePassword, logout }