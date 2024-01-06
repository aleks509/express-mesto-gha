import mongoose from "mongoose";
import bodyParser from "body-parser";
import express, { Router } from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { createUser, login } from "./controllers/users";
import userRouter from "./routes/users";
import cardRouter from "./routes/cards";
import auth from "./middlewares/auth";

const { PORT, MONGO_URL } = process.env;
const app = express();
const router = Router();
app.use(cookieParser());

mongoose.connect(MONGO_URL);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.post("/signin", login); // log-in with your credentials
app.post("/signup", createUser); // регистрация

app.use(auth);

router.use("/users", userRouter);
router.use("/cards", cardRouter);
router.all("*", (req, res) => res.status(404).send({ message: "Запрашиваемый ресурс не найден" }));

app.use(router);

app.use((err, req, res, next) => {
  // res.status(err.statusCode).send({ message: err.message });
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? "На сервере произошла ошибка"
        : message,
    });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
