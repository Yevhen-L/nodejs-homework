const contactsRouter = require("express").Router();
const controllers = require("../../controllers/index");
const asyncHandler = require("express-async-handler");
const validateId = require("../../middlewares/validateByID");
const contactsController = controllers.contactsController;

contactsRouter.post(
  "/",
  (req, res, next) => {
    console.log("joi");
    next();
  },
  contactsController.createContact
);

contactsRouter.get("/:id", validateId, contactsController.getOneContact);

contactsRouter.get("/contacts", contactsController.getAllContacts);

contactsRouter.delete("/:id", validateId, contactsController.removeContact);

contactsRouter.patch("/:id", validateId, contactsController.updateContactInfo);

contactsRouter.patch(
  "/:id/favorite",
  validateId,
  asyncHandler(contactsController.updateFavoriteStatus)
);

module.exports = contactsRouter;
