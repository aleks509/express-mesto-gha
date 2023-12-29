import mongoose from "mongoose";
import validator from "validator";

const userScheme = new mongoose.Schema(
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
    about: {
      type: String,
      ruquired: {
        value: true,
        message: "Поле about является обязательным",
      },
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Некорректный URL",
      },
      ruquired: true,
    },
  },
  { versionKey: false },
);

export default mongoose.model("user", userScheme);
