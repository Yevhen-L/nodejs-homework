const Contact = require("../schemas/dbConnect");

const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error getting contacts:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    res.status(contact ? 200 : 404).json(contact || { message: "Not found" });
  } catch (error) {
    console.error("Error getting contact by ID:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createContact = async (req, res) => {
  try {
    const newContact = await Contact.create({
      ...req.body,
      favorite: req.body.favorite || false,
    });
    res.status(201).json(newContact);
  } catch (error) {
    console.error("Error creating contact:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteContact = async (req, res) => {
  try {
    const result = await Contact.findByIdAndDelete(req.params.id);
    res
      .status(result ? 200 : 404)
      .json(result ? { message: "Contact deleted" } : { message: "Not found" });
  } catch (error) {
    console.error("Error deleting contact:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateContactInfo = async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { ...req.body, favorite: req.body.favorite || false },
      { new: true }
    );
    res
      .status(updatedContact ? 200 : 404)
      .json(updatedContact || { message: "Not found" });
  } catch (error) {
    console.error("Error updating contact:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateFavoriteStatus = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { body } = req;

    // Виклик функції для оновлення статусу контакту
    const updatedContact = await updateStatusContact(contactId, body);

    // Відправлення відповіді з оновленим контактом і статусом 200
    res.status(200).json(updatedContact);
  } catch (error) {
    // Обробка помилок
    if (error.message === "missing field favorite") {
      // Поле favorite не передано в тілі запиту
      res.status(400).json({ message: "missing field favorite" });
    } else if (error.message === "Not found") {
      // Контакт не знайдено
      res.status(404).json({ message: "Not found" });
    } else {
      // Інші помилки
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
};

const updateStatusContact = async (contactId, body) => {
  // Перевірка, чи передано поле favorite
  if (body.favorite === undefined) {
    throw new Error("missing field favorite");
  }

  // Оновлення статусу контакту
  const updatedContact = await Contact.findByIdAndUpdate(
    contactId,
    { favorite: body.favorite },
    { new: true }
  );
  // Перевірка, чи контакт існує
  if (!updatedContact) {
    throw new Error("Not found");
  }
  return updatedContact;
};

module.exports = {
  getContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContactInfo,
  updateFavoriteStatus,
};
