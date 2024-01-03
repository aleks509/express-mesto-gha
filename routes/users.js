import { Router } from "express";
import {
  getUserInfo,
  getUsers,
  getUserById,
  updateProfile,
  updateAvatar,
} from "../controllers/users";

const userRouter = Router();

userRouter.get("/me", getUserInfo);
userRouter.get("/", getUsers);
userRouter.get("/:userId", getUserById);
userRouter.patch("/me", updateProfile);
userRouter.patch("/me/avatar", updateAvatar);

export default userRouter;
