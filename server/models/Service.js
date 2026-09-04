const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Service description is required'],
      trim: true,
    },
    steps: {
      type: [String],
      required: true,
      default: [],
    },
    requiredDocuments: {
      type: [String],
      required: true,
      default: [],
    },
    officialSource: {
      type: String,
      required: [true, 'Official source link is required'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Service', serviceSchema);
