const mongoose = require("mongoose");

const noteSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  createDate: {
    type: Date,
    required: true,
  },
  updateDate: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("note", noteSchema);
