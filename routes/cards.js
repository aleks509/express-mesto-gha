import { Router } from "express";
import {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} from "../controllers/cards.js";

const cardRouter = Router();

cardRouter.post("/", createCard);
cardRouter.get("/", getCards);
cardRouter.delete("/:cardId", deleteCard);
cardRouter.put("/:cardId/likes", likeCard);
cardRouter.delete("/:cardId/likes", dislikeCard);

export default cardRouter;
