
import { Router } from 'express';
import { createUser, getUsers, getUserById }  from '../controllers/users'

const userRouter = Router();

userRouter.get('/', getUsers)
 

userRouter.get('/:userId', getUserById)

userRouter.post('/', createUser);

export default userRouter;