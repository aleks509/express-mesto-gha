import { Router } from 'express';
import { createCard, getCards, deleteCard } from '../controllers/cards';

const cardRouter = Router();

cardRouter.post('/', createCard)
cardRouter.get('/', getCards)
cardRouter.delete('/:cardId', deleteCard)

export default cardRouter