const { error } = require("console");
const asyncHandler = require("express-async-handler");
const ContactsModel = require("../models/ContactsModel");
const { isValidObjectId } = require("mongoose");

class ContactsController {
  createContact = asyncHandler(async (req, res) => {
    const { name, email, phone, favorite } = req.body;
    if (!name || !email || !phone || favorite === undefined) {
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
      res.status(404);
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

    if (!contactRemove) {
      res.status(404);
      throw new Error(`ID: ${id} is not found`);
    }

    res.status(200).json({
      code: 200,
      data: contactRemove,
      message: `Contact ${contactRemove.name} with ID ${contactRemove.id} deleted`,
    });
  });

  updateContactInfo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const contact = await ContactsModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!contact) {
      res.status(404);
      throw new Error(`ID: ${id} is not found`);
    }

    res.status(200).json({ code: 200, data: contact, message: "updated" });
  });

  updateFavoriteStatus = async (req, res) => {
    const { id } = req.params;
    const isValidId = isValidObjectId(id);

    if (!isValidId) {
      res.status(400).json({ message: `${id} isn't a valid contactId!` });
      return;
    }

    const body = req.body;
    const { error } = ContactsModel.validate(body);

    if (error) {
      res.status(400).json({ message: "missing required favourite field" });
      return;
    }

    const result = await ContactsModel.findByIdAndUpdate(id, body, {
      new: true,
    }).lean();

    res.json(result);
  };
}

module.exports = new ContactsController();
