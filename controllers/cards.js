import Card from '../models/Card'

export const createCard = (req, res) => {
    const { name, link } = req.body;
    console.log(req.body)
    Card.create({ name, link, owner: req.user._id })
    .then(card => res.status(200).send(card))
    .catch((err) => {
        if(err.name === 'ValidationError') {
            return res.status(400).send({
                message: "Переданы некорректные данные при создании карточки."
            })
        }
        return res.status(500).send({ message: 'Ошибка на стороне сервера' })
    })
}

export const getCards = (req, res) => {
    Card.find({})
    .then(cards => res.status(200).send(cards))
    .catch(err => res.status(500).send({ message: 'Ошибка на стороне сервера'}))
};

export const deleteCard = (req, res) => {
    const { cardId } = req.params
    Card.findByIdAndDelete(cardId)
    .populate('owner')
    .then((card) => {
      if(!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
        res.status(200).send({ message: 'Карточка успешно удалена', card: card })
    })
    .catch(err => res.status(500).send({ message: 'Ошибка на стороне сервера'}))
}

export const likeCard = (req, res) => {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true })
    .populate(['owner', 'likes'])
    .then((card) => {
        if(!card) {
            return res.status(404).send({ message: 'Карточка не найдена' });
        }
        res.status(201).send({ message: 'Вам понравилась эта карточка', card: card })
    })
    .catch(() => res.status(404).send({ message: 'Карточка не найдена' }))
}

export const dislikeCard = (req, res) => {
    Card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } }, // убрать _id из массива
        { new: true })
        .populate(['owner', 'likes'])
        .then((card) => {
            if (!card) {
              return res.status(404).send({ message: 'Карточка не найдена' });
            }
            res.status(200).send({ message: 'Вам разонравилась карточка:(', card: card });
          })
          .catch(err => res.status(500).send({ message: 'Ошибка на стороне сервера'}))
        };