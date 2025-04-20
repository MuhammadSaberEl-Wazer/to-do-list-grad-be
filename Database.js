const mongoose = require("mongoose");
const Note = require("./schemas/note");

class Database {
  constructor() {
    // this.url = "mongodb://localhost:27017/notaty";
    this.url =
      process.env.MONGODB_URL ||
      "mongodb+srv://notaty_user:notaty_pass123@cluster0.yduoa5x.mongodb.net/notaty?retryWrites=true&w=majority&appName=Cluster0";
  }

  connect() {
    mongoose
      .connect(this.url) // Just the connection string is sufficient
      .then(() => {
        console.log("Database connected successfully!");
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }

  addNote(note) {
    return new Promise((resolve, reject) => {
      note["createDate"] = new Date();
      note["updateDate"] = new Date();
      let newNote = new Note(note);
      newNote
        .save()
        .then((doc) => {
          resolve(doc);
        })
        .catch((err) => {
          reject(doc);
        });
    });
  }

  getNotes() {
    return new Promise((resolve, reject) => {
      Note.find({})
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getNoteById(id) {
    return new Promise((resolve, reject) => {
      Note.findById(id)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  updateNote(note) {
    return new Promise((resolve, reject) => {
      note["updateDate"] = new Date();
      Note.findByIdAndUpdate(note["_id"], note)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  deleteNote(id) {
    return new Promise((resolve, reject) => {
      Note.findByIdAndDelete(id)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  getNotesByTitle(noteTitle) {
    return new Promise((resolve, reject) => {
      const query = {
        title: {
          $regex: new RegExp(noteTitle, "i"),
        },
      };
      Note.find(query)
        .then((data) => {
          resolve(data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}

module.exports = Database;
