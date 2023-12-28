import Card from '../models/Card'

export const createCard = (req, res) => {
    const { name, link } = req.body;
    Card.create({ name, link })
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
    console.log(req.params)
    Card.findByIdAndDelete(cardId)
    .then((card) => {
      if(!card) {
        return res.status(404).send({ message: 'Карточка не найдена' });
      }
        res.status(200).send({ message: 'Карточка успешно удалена', card: card })
    })
    .catch((err) => {
        res.status(500).send({ message: 'Произошла ошибка', error: err.message });
      })}

