const mongoose = require("mongoose");
const Tag = require("../schemas/tag"); // تأكد من صحة المسار

const tags = [
  {
    name: "Urgent",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#ef4444",
  },
  {
    name: "Idea",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#3b82f6",
  },
  {
    name: "Personal",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#f59e0b",
  },
  {
    name: "Work",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#6366f1",
  },
  {
    name: "Todo",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#10b981",
  },
  {
    name: "Inspiration",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#8b5cf6",
  },
  {
    name: "Bug",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#dc2626",
  },
  {
    name: "Meeting",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#0ea5e9",
  },
  {
    name: "Reminder",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#eab308",
  },
  {
    name: "Reading",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#14b8a6",
  },
  {
    name: "Shopping",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#ec4899",
  },
  {
    name: "Fitness",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#22c55e",
  },
  {
    name: "Finance",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#4b5563",
  },
  {
    name: "Health",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#6b7280",
  },
  {
    name: "Travel",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#0f766e",
  },
  {
    name: "Wishlist",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#c084fc",
  },
  {
    name: "Project",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#7c3aed",
  },
  {
    name: "Event",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#f97316",
  },
  {
    name: "Quote",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#38bdf8",
  },
  {
    name: "Learning",
    createDate: new Date(),
    updateDate: new Date(),
    color: "#16a34a",
  },
];

mongoose
  .connect("mongodb+srv://notaty_user:notaty_pass123@cluster0.yduoa5x.mongodb.net/notaty?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    for (const tag of tags) {
      const exists = await Tag.findOne({ name: tag.name });
      if (!exists) {
        await Tag.create(tag);
        console.log(`تمت إضافة الوسم: ${tag.name}`);
      } else {
        console.log(`الوسم موجود بالفعل: ${tag.name}`);
      }
    }

    // عرض جميع الوسوم بعد الإضافة
    const allTags = await Tag.find();

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error(err);
    mongoose.disconnect();
  });
