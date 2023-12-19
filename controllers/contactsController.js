const ContactsModel = require("../models/ContactsModel");

class ContactsController {
  createContact = async (req, res) => {
    const contact = await ContactsModel.create({ ...req.body });
    res.status(201).json({ code: 201, data: contact, message: "OK" });
  };
  getOneContact = (req, res) => {
    res.send("test getOneContact");
  };
  getAllContacts = (req, res) => {
    res.send("test getAllContacts");
  };
  removeContact = (req, res) => {
    res.send("test removeContact");
  };
  updateContactInfo = (req, res) => {
    res.send("test updateContactInfo");
  };
  updateContactInfo = (req, res) => {
    res.send("test updateContactInfo");
  };
  updateFavoriteStatus = (req, res) => {
    res.send("test updateFavoriteStatus");
  };
}
module.exports = new ContactsController();
// try {
//   const newContact = await Contact.create({
//     ...req.body,
//     favorite: req.body.favorite || false,
//   });
//   res.status(201).json(newContact);
// } catch (error) {
//   console.error("Error creating contact:", error.message);
//   res
//     .status(500)
//     .json({
//       message: "Internal Server Error-ХЗ що сталось з createContact",
//     });
// }
//   };
// }

// const Contact = require("../routes/api/contactsRoutes");

// const getAllContacts = async (req, res) => {
//   try {
//     const contacts = await Contact.find();
//     res.status(200).json(contacts);
//   } catch (error) {
//     console.error("Error getting contacts:", error.message);
//     res.status(500).json({
//       message: "Internal Server Error ХЗ що сталось з getContactsALL",
//     });
//   }
// };

// const getOneContact = async (req, res) => {
//   try {
//     const contact = await Contact.findById(req.params.id);
//     res.status(contact ? 200 : 404).json(contact || { message: "Not found" });
//   } catch (error) {
//     console.error("Error getting contact by ID:", error.message);
//     res.status(500).json({
//       message: "Internal Server Error ХЗ що сталось з getContactById 000",
//     });
//   }
// };

//

// const deleteContact = async (req, res) => {
//   try {
//     const result = await Contact.findByIdAndDelete(req.params.id);
//     res
//       .status(result ? 200 : 404)
//       .json(result ? { message: "Contact deleted" } : { message: "Not found" });
//   } catch (error) {
//     console.error("Error deleting contact:", error.message);
//     res
//       .status(500)
//       .json({ message: "Internal Server Error-ХЗ що сталось 3 deleteContact" });
//   }
// };

// const updateContactInfo = async (req, res) => {
//   try {
//     const updatedContact = await Contact.findByIdAndUpdate(
//       req.params.id,
//       { ...req.body, favorite: req.body.favorite || false },
//       { new: true }
//     );
//     res
//       .status(updatedContact ? 200 : 404)
//       .json(updatedContact || { message: "Not found" });
//   } catch (error) {
//     console.error("Error updating contact:", error.message);
//     res.status(500).json({
//       message: "Internal Server Error-ХЗ що сталось з updateContactInfo",
//     });
//   }
// };

// const updateFavoriteStatus = async (req, res) => {
//   try {
//     const { contactId } = req.params;
//     const { body } = req;

//     // Виклик функції для оновлення статусу контакту
//     const updatedContact = await updateStatusContact(contactId, body);

//     // Відправлення відповіді з оновленим контактом і статусом 200
//     res.status(200).json(updatedContact);
//   } catch (error) {
//     // Обробка помилок
//     if (error.message === "missing field favorite") {
//       // Поле favorite не передано в тілі запиту
//       res.status(400).json({ message: "missing field favorite" });
//     } else if (error.message === "Not found") {
//       // Контакт не знайдено
//       res.status(404).json({ message: "Not found" });
//     } else {
//       // Інші помилки
//       res.status(500).json({ message: "Internal Server Error-ХЗ що сталось" });
//     }
//   }
// };

// const updateStatusContact = async (contactId, body) => {
//   // Перевірка, чи передано поле favorite
//   if (body.favorite === undefined) {
//     throw new Error("missing field favorite");
//   }

//   // Оновлення статусу контакту
//   const updatedContact = await Contact.findByIdAndUpdate(
//     contactId,
//     { favorite: body.favorite },
//     { new: true }
//   );
//   // Перевірка, чи контакт існує
//   if (!updatedContact) {
//     throw new Error("Not found");
//   }
//   return updatedContact;
// };

// {
//   getAllContacts,
//   getOneContact,
//   createContact,
//   deleteContact,
//   updateContactInfo,
//   updateFavoriteStatus,
// };
