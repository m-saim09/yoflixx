const Contact = require("../models/Contact");
const { asyncHandler } = require("../utils/asyncHandler");
const { AppError } = require("../utils/appError");
const { validateContactPayload } = require("../utils/validation");

const createContact = asyncHandler(async (req, res) => {
  const { errors, value } = validateContactPayload(req.body);

  if (Object.keys(errors).length) {
    throw new AppError(Object.values(errors)[0], 400);
  }

  const contact = await Contact.create(value);

  res.status(201).json({
    success: true,
    message: "Contact request submitted successfully",
    data: { contact },
  });
});

const getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });

  res.json({
    success: true,
    message: "Contacts fetched successfully",
    data: { contacts, total: contacts.length },
  });
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);

  if (!contact) {
    throw new AppError("Contact not found", 404);
  }

  res.json({
    success: true,
    message: "Contact deleted successfully",
    data: null,
  });
});

module.exports = {
  createContact,
  getContacts,
  deleteContact,
};
