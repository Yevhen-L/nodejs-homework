const contactsController = require("../controllers/contactsController");

const contactsRouter = require("express").Router();

contactsRouter.post("/contacts", contactsController.createContact);

contactsRouter.get("/contacts/:id", contactsController.getOneContact);

contactsRouter.get("/contacts", contactsController.getAllContacts);

contactsRouter.delete("/contacts/:id", contactsController.removeContact);

contactsRouter.patch("/contacts/:id", contactsController.updateContactInfo);

contactsRouter.patch(
  "/contacts/:id/favorite",
  contactsController.updateFavoriteStatus
);

module.exports = contactsRouter;
