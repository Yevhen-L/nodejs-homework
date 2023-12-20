const { error } = require("console");
const asyncHandler = require("express-async-handler");
const ContactsModel = require("../models/ContactsModel");

class ContactsController {
  createContact = asyncHandler(async (req, res) => {
    const { name, email, phone, favorite } = req.body;
    if (!name || !email || !phone || !favorite) {
      res.status(400);
      throw new Error(
        "Controller validation. Please, provide all required fields!"
      );
    }
    const newContact = await ContactsModel.create({ ...req.body });
    res.status(201).json({ code: 201, data: newContact, message: "OK" });
  });

  getOneContact = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const contact = await ContactsModel.findById(id);
    if (!contact) {
      res.status(400);
      throw new Error(`ID: ${id} is not found`);
    }
    res.status(200).json({ code: 200, data: contact, message: "OK" });
  });

  getAllContacts = asyncHandler(async (req, res) => {
    const contacts = await ContactsModel.find({});
    res
      .status(200)
      .json({ code: 200, qty: contacts.length, data: contacts, message: "OK" });
  });

  removeContact = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const contactRemove = await ContactsModel.findByIdAndDelete(id);

    res
      .status(200)
      .json({ code: 200, data: contactRemove, message: "Deleted" });
  });

  updateContactInfo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const contact = await ContactsModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!contact) {
      res.status(400);
      throw new Error(`ID: ${id} is not found`);
    }
    res.status(200).json({ code: 200, data: contact, message: "updated" });
  });

  updateFavoriteStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { favorite } = req.body;

    try {
      if (favorite === undefined) {
        throw new Error("missing field favorite");
      }
      const updatedContact = await ContactsModel.findByIdAndUpdate(
        id,
        { favorite },
        { new: true }
      );
      if (!updatedContact) {
        res.status(404).json({ code: 404, message: "Not found" });
        return;
      }
      res.status(200).json({ code: 200, data: updatedContact, message: "OK" });
    } catch (error) {
      if (error.message === "missing field favorite") {
        res.status(400).json({ code: 400, message: "missing field favorite" });
      } else {
        res.status(500).json({ code: 500, message: "Internal Server Error" });
      }
    }
  });
}

module.exports = new ContactsController();
