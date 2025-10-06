const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController")
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation")

//Router to account management page
router.get("/", utilities.checkLogin,
  utilities.handleErrors(accountController.deliverAccountManagement))

//Route to request login view through accController
router.get("/login",
  utilities.handleErrors(accountController.buildLogin));

//Route to registration view
router.get("/register", utilities.handleErrors(accountController.buildRegistration))

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to submit registration form
router.post("/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount))

//Route to deliver account update view
router.get("/update/:accountId", utilities.handleErrors(accountController.buildAccountUpdate))


//Route to submit account update form
router.post("/details-update",
  regValidate.updateRules(),
  regValidate.checkUpdatePersonalData,
  utilities.handleErrors(accountController.updatePersonal)
 )

//Route to submit password update form
router.post("/password-update",
  regValidate.changePasswordRules(),
  regValidate.checkPasswordData,
  utilities.handleErrors(accountController.updatePassword)
)

//Route to log out
router.get("/logout", utilities.handleErrors(accountController.logout))

//export router module
module.exports = router;