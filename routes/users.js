
import { Router } from 'express';
import { createUser }  from '../controllers/users'

const userRouter = Router();


userRouter.get('/', (req, res, next) => (
    res.status(200).send({ message: 'Hello'})
  ))


userRouter.get('/:userId', (req, res) => {
    res.status(200).send({ message: 'Boom'})
    // res.send(req.params)
  })
  userRouter.post('/', createUser);

  export default userRouter;