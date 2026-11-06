const Student = require('../models/Student');

const findActive = ({ filiere } = {}) => {
  const filter = { isDeleted: false };
  if (filiere) filter.filiere = filiere;

  return Student.find(filter).sort({ createdAt: -1 });
};

const findDeleted = () => Student.find({ isDeleted: true }).sort({ updatedAt: -1 });

const findActiveById = (id) => Student.findOne({ _id: id, isDeleted: false });

const findDeletedByEmail = (email) => Student.findOne({ email, isDeleted: true });

const create = (data) => Student.create(data);

const updateActiveById = (id, updates) =>
  Student.findOneAndUpdate({ _id: id, isDeleted: false }, updates, {
    new: true,
    runValidators: true,
  });

const restoreAndUpdateById = (id, updates) =>
  Student.findByIdAndUpdate(id, { ...updates, isDeleted: false }, {
    new: true,
    runValidators: true,
  });

const softDeleteById = (id) =>
  Student.findOneAndUpdate({ _id: id, isDeleted: false }, { isDeleted: true }, { new: true });

const restoreById = (id) =>
  Student.findOneAndUpdate({ _id: id, isDeleted: true }, { isDeleted: false }, { new: true });

module.exports = {
  findActive,
  findDeleted,
  findActiveById,
  findDeletedByEmail,
  create,
  updateActiveById,
  restoreAndUpdateById,
  softDeleteById,
  restoreById,
};
