import { Router } from "express";
import userRouter from "./users";
import cardRouter from "./cards";

const router = Router();

router.use("/users", userRouter);
router.use("/cards", cardRouter);

router.all("*", (req, res) => res.status(404).send({ message: "Запрашиваемый ресурс не найден" }));

export default router;
