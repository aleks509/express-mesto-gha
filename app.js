import router from './routes/index';
import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

const { PORT = 3000 } = process.env;
const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use((req, res, next) => {
  req.user = {
    _id: '658c7d22f1e6a10eae66f391' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
}); 

app.use(router)

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
