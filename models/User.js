import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userScheme = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "Жак-Ив Кусто",
      minlength: 2,
      maxlength: 30,
    },
    about: {
      type: String,
      default: "Исследователь",
      minlength: 2,
      maxlength: 30,
    },
    avatar: {
      type: String,
      default: "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
      validate: {
        validator: (value) => validator.isURL(value),
        message: "Некорректный URL",
      },
    },
    email: {
      type: String,
      required: {
        value: true,
        message: "Поле email явлеятся обязательным",
      },
      unique: true,
    },
    password: {
      type: String,
      required: {
        value: true,
        message: "Поле password явлеятся обязательным",
      },
      minlength: 4,
      select: false,
    },
  },
  { versionKey: false },
);

userScheme.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Неправильные почта или пароль"));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error("Неправильные почта или пароль"));
          }

          return user; // теперь user доступен
        });
    });
};

export default mongoose.model("user", userScheme);
