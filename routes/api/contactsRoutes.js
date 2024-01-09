const contactsRouter = require("express").Router();
const controllers = require("../../controllers/index");
const asyncHandler = require("express-async-handler");
const validateByID = require("../../middlewares/validateByID");
const contactsController = controllers.contactsController;

contactsRouter.post(
  "/",
  (req, res, next) => {
    console.log("joi");
    next();
  },
  contactsController.createContact
);

contactsRouter.get("/:id", validateByID, contactsController.getOneContact);

contactsRouter.get("/", contactsController.getAllContacts);

contactsRouter.delete("/:id", validateByID, contactsController.removeContact);

contactsRouter.patch(
  "/:id",
  validateByID,
  contactsController.updateContactInfo
);

contactsRouter.patch(
  "/:id/favorite",
  validateByID,
  asyncHandler(contactsController.updateFavoriteStatus)
);

module.exports = contactsRouter;
