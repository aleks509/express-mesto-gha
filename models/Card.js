import mongoose from "mongoose";

const cardScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      ruquired: {
        value: true,
        message: "Поле name является обязательным",
      },
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      ruquired: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      ruquired: true,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ruquired: true,
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { versionKey: false },
);

export default mongoose.model("card", cardScheme);
