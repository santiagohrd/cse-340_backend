const express = require("express")
const router = new express.Router() 
const baseController = require("../controllers/baseController")
const utilities = require("../utilities")

//Router to base controller for error view
router.get("/error", utilities.handleErrors(baseController.throwError));

module.exports = router;