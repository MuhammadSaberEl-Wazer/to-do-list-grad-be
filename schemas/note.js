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
  createDate: {
    type: Date,
    require: true,
  },
  updateDate: {
    type: Date,
    require: true,
  },
});

module.exports = mongoose.model("note", noteSchema);
