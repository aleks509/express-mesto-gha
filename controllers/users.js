import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";
import User from "../models/User";
import NotFoundError from "../errors/NotFoundError";
import ValidationError from "../errors/ValidationError";
import UnauthorizedError from "../errors/UnauthorizedError";
import ConflictError from "../errors/ConflictError";

const { NODE_ENV, JWT_SECRET } = process.env;

const MONGO_ERROR_CODE_DUPLICATE = 11000;
const CREATED_CODE = 201;
// const BAD_REQUEST_ERROR_CODE = 400;
// const UNAUTHORIZED_ERROR_CODE = 401;
// const NOT_FOUND_ERROR_CODE = 404;
// const CONFLICT_ERROR_CODE = 409;
// const INTERNAL_SERVER_ERROR_CODE = 500;
const SOLT_ROUND = 10;

export const login = (req, res, next) => {
  const { email, password } = req.body || {};
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "some-secret-key",
        { expiresIn: "7d" },
      );

      res
        .cookie("jwt", token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
        })
        .end();
    })
    .catch(next);
};

export const getUserInfo = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email })
  // метод orFail обрабатывает случаи запросов к БД, которые не возвращают результат
    .orFail(() => {
      throw new NotFoundError("Пользователь не найден");
    })
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};

export const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, SOLT_ROUND)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))

    .then((user) => res.status(CREATED_CODE).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      password: user.password,
    }))
    .catch((error) => {
      if (error.code === MONGO_ERROR_CODE_DUPLICATE) {
        return next(new ConflictError("Такой пользователь уже существует"));
      }
      return next(error);
    });
};

export const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(next);
};

export const getUserById = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError("Пользователь не найден");
    })
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.name === "CastError") {
        return next(new ValidationError("Некорректный идентификатор карточки"));
      }
      return next(error);
    });
};

export const updateProfile = (req, res, next) => {
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
        throw new NotFoundError("Пользователь не найден");
      }
      return res.send(user);
    })
    .catch(next);
};

export const updateAvatar = (req, res, next) => {
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
        throw new NotFoundError("Пользователь не найден");
      }
      return res.send(user);
    })
    .catch(next);
};
