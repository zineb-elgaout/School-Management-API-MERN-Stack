const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom est obligatoire'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L\'email est obligatoire'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    filiere: {
      type: String,
      required: [true, 'La filière est obligatoire'],
      enum: ['INFO', 'MATH', 'ECO', 'PHYS', 'CHIMIE'],
      uppercase: true,
    },
    grades: {
      type: [Number],
      default: [],
      validate: {
        validator: (grades) => grades.every(g => g >= 0 && g <= 20),
        message: 'Les notes doivent être entre 0 et 20',
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // createdAt + updatedAt automatiques
  }
);

module.exports = mongoose.model('Student', studentSchema);