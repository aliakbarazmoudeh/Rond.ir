require('dotenv').config();
require('express-async-errors');
const cluster = require('cluster');
const os = require('os');
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    // console.log(`Worker process ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // express

  const express = require('express');
  const app = express();
  // rest of the packages
  const cookieParser = require('cookie-parser');
  const rateLimiter = require('express-rate-limit');
  const helmet = require('helmet');
  const xss = require('xss-clean');
  const cors = require('cors');

  // database
  const connectDB = require('./db/connect');

  // rabbit mq
  const {
    consumeUserDeleteDirectMessage,
    consumeUserRegisterDirectMessage,
    consumeUserUpdateDirectMessage,
  } = require('./queues/consumer');

  //  routers
  const simRouter = require('./routes/simRoutes');

  // middleware
  const notFoundMiddleware = require('./middleware/not-found');
  const errorHandlerMiddleware = require('./middleware/error-handler');

  // app.set('trust proxy', 1);
  // app.use(
  //   rateLimiter({
  //     windowMs: 15 * 60 * 1000,
  //     max: 60,
  //   })
  // );
  app.use(helmet());
  app.use(cors());
  app.use(xss());

  app.use(express.json());
  app.use(cookieParser(process.env.JWT_SECRET));

  app.use(simRouter);
  app.use(notFoundMiddleware);
  app.use(errorHandlerMiddleware);

  const port = process.env.PORT || 5001;
  const start = async () => {
    try {
      // { alter: true }
      await connectDB.sync({ logging: false });
      await consumeUserRegisterDirectMessage();
      await consumeUserDeleteDirectMessage();
      await consumeUserUpdateDirectMessage();
      console.log('connected to db');
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };

  start();
}
