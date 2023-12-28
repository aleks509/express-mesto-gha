import User from '../models/User'

 export const createUser = (req, res) => {
    const { name, about, avatar } = req.body;
    User.create({ name, about, avatar })
     .then(user => res.status(200).send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar
   }))
   .catch((err) => {
    if(err.name === 'ValidationError') {
        return res.status(400).send({
            message: "Переданы некорректные данные при создании пользователя."
        })
    }
    return res.status(500).send({ message: 'Ошибка на стороне сервера' })
})
  };

  export const getUsers = (req, res) => {
    User.find({})
    .then(users => res.status(200).send(users))
    .catch(err => res.status(500).send({ message: 'Ошибка на стороне сервера'}))
  };

  export const getUserById = (req, res) => {
    const { _id } = req.user
    User.findById(_id)
    .then((user) => {
      if(!user) {
        throw new Error('NotFoundError')
      }
        res.status(200).send(user)
    })
    .catch((error) => {
      if( error.message === 'NotFoundError') {
        return res.status(404).send({ message: "Пользователь не найден"})
      }
      return res.status(500).send({ message: 'Произошла ошибка' });
    })};