require('dotenv').config();
require('express-async-errors');

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

//  routers
const userRouter = require('./routes/userRoutes');

// middleware
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

app.use(helmet());
app.use(cors());
app.use(xss());

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

// swagger
const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

app.get('/', async (req, res) => {
  res.send();
});
app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(userRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    // { alter: true }
    await connectDB.sync({ alter: true, logging: false });
    console.log('connected to db');
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
