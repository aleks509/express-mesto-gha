import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
import User from "../models/User";
import NotFoundError from "../errors/NotFoundError";

const MONGO_ERROR_CODE_DUPLICATE = 11000;

const handleValidationError = (error, res) => {
  if (error.name === "ValidationError") {
    return res
      .status(400)
      .send({ message: "Переданы некорректные данные" });
  }
  return res.status(500).send({ message: "Ошибка на стороне сервера" });
};

export const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true, // добавили опцию
        })
        .end(); // если у ответа нет тела, можно использовать метод end
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

export const getUserInfo = (req, res) => {
  const { email } = req.body;
  User.findOne({ email })
    .orFail(() => new NotFoundError("Пользователь не найден"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.message === "NotFoundError") {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.status(500).send({ message: "Ошибка на стороне сервера" });
    });
};

export const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))

    .then((user) => res.status(201).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      password: user.password,
    }))
    .catch((error) => {
      if (error.code === MONGO_ERROR_CODE_DUPLICATE) {
        return res.status(409).send({ message: "Такой пользователь уже существует" });
      }
      return handleValidationError(error, res);
    });
};

export const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: "Ошибка на стороне сервера" }));
};

export const getUserById = (req, res) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => new Error("NotFoundError"))
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => {
      if (error.message === "NotFoundError") {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      if (error.name === "CastError") {
        return res
          .status(400)
          .send({ message: "Некорректный идентификатор карточки" });
      }
      return res.status(500).send({ message: "Ошибка на стороне сервера" });
    });
};

export const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.send(user);
    })
    .catch((error) => handleValidationError(error, res));
};

export const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "Пользователь не найден" });
      }
      return res.send(user);
    })
    .catch((error) => handleValidationError(error, res));
};
