// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const regValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId",
    utilities.handleErrors(invController.buildByClassificationId));

//Route to build detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

//Route to add new classification and inventory item
router.get("/", utilities.checkAccess, utilities.handleErrors(invController.buildManagementPage));

//Route to add new classification
router.get("/add-classification", utilities.checkAccess, utilities.handleErrors(invController.deliverAddClassification));

//Post new classification data
router.post(
    "/add-classification",
    utilities.checkAccess,
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification)
);

// Route to add new inventory
router.get("/add-inventory", utilities.checkAccess, utilities.handleErrors(invController.deliverAddInventory));

//Post new inventory data
router.post(
    "/add-inventory",
    utilities.checkAccess,
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    utilities.handleErrors(invController.addNewInventory),
);

//Route to fetch inventory data by classification id
router.get("/getInventory/:classification_id", utilities.checkAccess, utilities.handleErrors(invController.getInventoryJSON));

//Route to edit inventory entry
router.get("/edit/:inv_id", utilities.checkAccess, utilities.handleErrors(invController.editInventory));

//Route to submit updated form
router.post("/edit-inventory",
    utilities.checkAccess,
    regValidate.inventoryRules(),
    regValidate.checkUpdateData, 
    utilities.handleErrors(invController.updateInventory))

//Route to delete view
router.get("/delete/:inv_id", utilities.checkAccess, utilities.handleErrors(invController.confirmDelete));

//Route to delete inventory
router.post("/delete-inventory", utilities.checkAccess, utilities.handleErrors(invController.deleteInventory))

module.exports = router;