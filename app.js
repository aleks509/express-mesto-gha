import mongoose from "mongoose";
import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { Router } from "express";
import { createUser, login } from "./controllers/users";
import userRouter from "./routes/users";
import cardRouter from "./routes/cards";

const { PORT, MONGO_URL } = process.env;
const app = express();
const router = Router();
app.use(cookieParser());

mongoose.connect(MONGO_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.post("/signin", login);
app.post("/signup", createUser);

router.use("/users", userRouter);
router.use("/cards", cardRouter);
router.all("*", (req, res) => res.status(404).send({ message: "Запрашиваемый ресурс не найден" }));

app.use(router);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
