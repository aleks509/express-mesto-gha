
import { Router } from 'express';
import { createUser, getUsers, getUserById, updateProfile, updateAvatar }  from '../controllers/users'

const userRouter = Router();

userRouter.get('/', getUsers)
userRouter.get('/:userId', getUserById)
userRouter.post('/', createUser);
userRouter.patch('/me', updateProfile)
userRouter.patch('/me/avatar', updateAvatar)

export default userRouter;