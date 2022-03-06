const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const cors = require('cors');

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_PORT,
  REDIS_IP,
  REDIS_PASSWORD,
  REDIS_User,
  SESSION_SECRET,
} = require('./config/config');
const postRouter = require('./routes/postRoutes');
const userRouter = require('./routes/userRoute');
const app = express();
const port = process.env.PORT || 3000;
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;
const redisClient = redis.createClient({
  legacyMode: true,
  url: `redis://${REDIS_IP}:${REDIS_PORT}`,
  //host: REDIS_IP,
  //port: REDIS_PORT,
  //url: `redis://:${REDIS_User}:${REDIS_PASSWORD}@${REDIS_IP}:${REDIS_PORT}`,
});
const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((_) => {
      console.log('connected to mongodb !!!! ');
    })
    .catch((e) => {
      console.log('can not connect to db', e);
      setTimeout(() => {
        connectWithRetry();
      }, 5000);
    });
};
const retryConnectingRedis = () => {
  redisClient
    .connect((va) => {
      console.log(va);
    })
    .then((connected) => {
      console.log('redis connected');
      console.log(connected);
    })
    .catch((e) => {
      console.error('redis error', e);
      setInterval(() => {
        retryConnecting();
      }, 5000);
    });
};
// retryConnectingRedis();
connectWithRetry();

app.use(
  session({
    store: new redisStore({
      client: redisClient,
    }),
    secret: SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
    cookie: {
      httpOnly: true,
      maxAge: 300000,
    },
  })
);
// !! Create session when user logs in
app.enable('trust proxy');
app.use(cors({}));
app.use(express.json());
app.get('/api/v1', (req, res) => {
  res.send('Hello World');
  console.log('hello from intance');
});
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/users', userRouter);
app.listen(port, (res) =>
  console.log(`Example app listening on port${res}- ${port}!`)
);
