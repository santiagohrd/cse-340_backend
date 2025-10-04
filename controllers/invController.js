const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
*  Build item view
* ************************** */
invCont.buildByInvId = async function (req, res, next) {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id)
    const details = await utilities.buildDetailsDisplay(data)
    let nav = await utilities.getNav()
    const makeModelYear = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
    res.render("./inventory/details", {
        title: makeModelYear,
        nav,
        details,
    })
}

invCont.buildManagementPage = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "Manage Inventory",
    nav,
    errors: null,
    classificationSelect,
  })
}

//Deliver add classification view
invCont.deliverAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add new classification", 
    nav,
    errors: null,
  })
}

// //Deliver add inventory view
invCont.deliverAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add new inventory", 
    nav,
    classificationList,
    errors: null,
  })
}

//Add new classification 
invCont.addNewClassification = async function (req, res, next) {
  const {classification_name} = req.body;

  const addClassificationResult = await invModel.addClassification(
    classification_name
  )

  if (addClassificationResult) {
    req.flash(
      "notice",
      `New car classification - '${classification_name}' added successfully`
    )
    req.body = {}
    let nav = await utilities.getNav();
    res.status(201).render("inventory/add-classification", {
      title: "Add new classification",
      nav,
      errors: null,
    })
  } else {
    req.flash(
      "error",
      `Sorry, classification could not be added. Please try again`
    )
    res.status(501).render("inventory/add-classification", {
      title: "Add new classification",
      nav,
    })
  }
}

//Add new inventory
invCont.addNewInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  let classificationList = await utilities.buildClassificationList();
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

  const addInventoryResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )
if (addInventoryResult) {
    req.flash(
      "notice",
      `New inventory - '${inv_year} ${inv_make} ${inv_model}' added successfully`
    )
    req.body = {}
    res.redirect(303, "/inv")
  } else {
    req.flash(
      "error",
      `Sorry, inventory could not be added. Please try again`
    )
    res.status(501).render("inventory/add-inventory", {
      title: "Add new inventory",
      nav,

    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned."));
  }
}

//Deliver edit inventory view
invCont.editInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inventoryId = parseInt(req.params.inv_id);
  const result = await invModel.getInventoryByInvId(inventoryId);
  const itemData = result[0];
  const name = `${itemData.inv_make} ${itemData.inv_model}`
  let classificationList = await utilities.buildClassificationList(itemData.classification_id);
  res.render("./inventory/edit-inventory", {
    title: `Edit ${name}`, 
    nav,
    classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  })
}

//Update inventory data
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body;

  const updateResult = await invModel.updateInventory(
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
    classification_id
  )
if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList();
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash(
      "error",
      `Sorry, the insert failed.`
    )
    res.status(501).render("inventory/edit-inventory", {
      title: `Edit ${itemName}`,
      nav,
      classificationList: classificationList,
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
      classification_id
    })
  }
}

// Deliver Delete inventory VIEW
invCont.confirmDelete = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inventoryId = parseInt(req.params.inv_id);
  const result = await invModel.getInventoryByInvId(inventoryId);
  const itemData = result[0];
  const name = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: `Delete ${name}?`, 
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

//Delete inventory data
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body;
  const parsedInv = parseInt(inv_id);

  const deleteResult = await invModel.deleteInventory(
    parsedInv
  )

  if (deleteResult) {
    req.flash("notice", `The vehicle was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash(
      "error",
      `Sorry, the delete failed.`
    )
    res.status(501).render("inventory/delete-confirm", {
      title: `Delete ${itemName}?`,
      nav,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price,
    })
  }
}

module.exports = invCont