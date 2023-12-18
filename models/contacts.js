const Contact = require("../schemas/dbConnect");

async function listContacts() {
  try {
    const contacts = await Contact.find();
    return contacts;
  } catch (error) {
    throw new Error("Error fetching contacts");
  }
}

async function getById(contactId) {
  try {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      throw new Error("Contact not found");
    }
    return contact;
  } catch (error) {
    throw new Error("Error fetching contact by ID");
  }
}

async function addContact(contact) {
  try {
    const newContact = await Contact.create(contact);
    return newContact;
  } catch (error) {
    throw new Error("Error creating contact");
  }
}

async function removeContact(contactId) {
  try {
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
      throw new Error("Contact not found");
    }
    return { message: "Contact deleted" };
  } catch (error) {
    throw new Error("Error deleting contact");
  }
}

async function updateContact(contactId, updatedFields) {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      contactId,
      updatedFields,
      { new: true }
    );
    if (!updatedContact) {
      throw new Error("Contact not found");
    }
    return updatedContact;
  } catch (error) {
    throw new Error("Error updating contact");
  }
}

module.exports = {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
};
