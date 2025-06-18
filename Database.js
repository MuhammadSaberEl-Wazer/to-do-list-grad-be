const mongoose = require("mongoose");
const Note = require("./schemas/note");
const User = require("./schemas/user");
const Tag = require("./schemas/tag");
const bcrypt = require("bcrypt");

class Database {
  constructor() {
    this.url =
      process.env.MONGODB_URL ||
      "mongodb+srv://notaty_user:notaty_pass123@cluster0.yduoa5x.mongodb.net/notaty?retryWrites=true&w=majority&appName=Cluster0";
  }

  connect() {
    mongoose
      .connect(this.url)
      .then(() => {
        console.log("Database connected successfully!");
      })
      .catch((err) => {
        console.log("Error", err);
      });
  }

  async registerUser(userData) {
    try {
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error("Email already registered");
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      const user = new User({
        firstName: userData.firstName,
        email: userData.email,
        password: hashedPassword,
        createDate: new Date(),
      });

      const savedUser = await user.save();
      return { ...savedUser.toObject(), password: undefined };
    } catch (error) {
      throw error;
    }
  }

  async loginUser(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid email or password");
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new Error("Invalid email or password");
      }

      return { ...user.toObject(), password: undefined };
    } catch (error) {
      throw error;
    }
  }

  async addNote(note, userId) {
    try {
      const newNote = new Note({
        ...note,
        userId,
        tags: note.tags || [],
        createDate: new Date(),
        updateDate: new Date(),
      });
      return await newNote.save();
    } catch (error) {
      throw error;
    }
  }

  async getNotes(userId) {
    try {
      return await Note.find({ userId }).populate("tags");
    } catch (error) {
      throw error;
    }
  }

  async getAllTags() {
    try {
      return await Tag.find({});
    } catch (error) {
      throw error;
    }
  }

  async getNotesByTitle(title, userId) {
    try {
      return await Note.find({
        userId,
        title: { $regex: title, $options: "i" },
      });
    } catch (error) {
      throw error;
    }
  }

  async updateNote(note, userId) {
    try {
      const updatedNote = await Note.findOneAndUpdate(
        { _id: note._id, userId },
        {
          ...note,
          updateDate: new Date(),
        },
        { new: true }
      );
      if (!updatedNote) {
        throw new Error("Note not found or unauthorized");
      }
      return updatedNote;
    } catch (error) {
      throw error;
    }
  }

  async getNoteById(noteId, userId) {
    try {
      return await Note.findOne({ _id: noteId, userId });
    } catch (error) {
      throw error;
    }
  }

  async deleteNoteById(noteId, userId) {
    try {
      return await Note.findOneAndDelete({ _id: noteId, userId }).populate(
        "tags"
      );
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Database;
