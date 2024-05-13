require("dotenv").config();
require("express-async-errors");
// express
const express = require("express");
const app = express();
// const IP = require("ip");
// rest of the packages
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const rateLimiter = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const morgan = require("morgan");

// database
const connectDB = require("./db/connect");
const event = require("./commen/utils/removeOldRecords").query(
  "ads",
  "expireAt",
);

//  routers
const adsRouter = require("./routes/adsRoutes");

// middleware
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

// swagger
const swaggerUI = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger.yaml");

app.set("trust proxy", 1);
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
  }),
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(morgan("tiny"));

app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));
app.use(fileUpload({ useTempFiles: true }));

app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(adsRouter);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5003;

const start = async () => {
  try {
    // { alter: true }
    await connectDB.sync({ alter: true, logging: false });
    await connectDB.query(event);
    console.log("connected to db");
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`),
    );
  } catch (error) {
    console.log(error);
  }
};

start();
