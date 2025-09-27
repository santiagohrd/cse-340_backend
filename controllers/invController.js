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
  res.render("./inventory/management", {
    title: "Manage Inventory",
    nav,
    errors: null
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

module.exports = invCont