const contactsRouter = require("express").Router();
const contactsController = require("../controllers/contactsController");
const asyncHandler = require("express-async-handler");
const validateId = require("../middlewares/validateByID");

contactsRouter.post(
  "/contacts",
  (req, res, next) => {
    console.log("joi");
    next();
  },
  contactsController.createContact
);

contactsRouter.get(
  "/contacts/:id",
  validateId,
  contactsController.getOneContact
);

contactsRouter.get("/contacts", contactsController.getAllContacts);

contactsRouter.delete(
  "/contacts/:id",
  validateId,
  contactsController.removeContact
);

contactsRouter.patch(
  "/contacts/:id",
  validateId,
  contactsController.updateContactInfo
);

contactsRouter.patch(
  "/contacts/:id/favorite",
  validateId,
  contactsController.updateFavoriteStatus
);

module.exports = contactsRouter;
