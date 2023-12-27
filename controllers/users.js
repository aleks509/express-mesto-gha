import User from '../models/User'

 export const createUser = (req, res) => {
   console.log(req.params)
    const { name, about, avatar } = req.body;
    User.create({ name, about, avatar })
     // возвращаем записанные в базу данные пользователю
     .then(user => res.send({
      _id: user._id,
      name: user.name,
      about: user.about,
      avatar: user.avatar
   }))
     .catch(err => res.status(500).send({ message: 'Произошла ошибка' }))
  }

  