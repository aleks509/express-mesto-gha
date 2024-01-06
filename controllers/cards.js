import Card from "../models/Card";
import NotFoundError from "../errors/NotFoundError";
import ValidationError from "../errors/ValidationError";
// import UnauthorizedError from "../errors/UnauthorizedError";
// import ConflictError from "../errors/ConflictError";

const CREATED_CODE = 201;
// const BAD_REQUEST_ERROR_CODE = 400;
// const UNAUTHORIZED_ERROR_CODE = 401;
// const NOT_FOUND_ERROR_CODE = 404;
// const CONFLICT_ERROR_CODE = 409;
// const INTERNAL_SERVER_ERROR_CODE = 500;

export const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(CREATED_CODE).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new ValidationError("Переданы некорректные данные при создании карточки."));
      } else {
        next(err);
      }
    });
};

export const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

export const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndDelete(cardId)
    .populate("owner")
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка не найдена");
      }
      return res
        .send({ message: "Карточка успешно удалена", card });
    })
    .catch(next);
};

export const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .populate(["owner", "likes"])
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка не найдена");
      }
      return res
        .send({ message: "Вам понравилась эта карточка", card });
    })
    .catch(next);
};

export const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .populate(["owner", "likes"])
    .then((card) => {
      if (!card) {
        throw new NotFoundError("Карточка не найдена");
      }
      return res
        .send({ message: "Вам разонравилась карточка:(", card });
    })
    .catch(next);
};
