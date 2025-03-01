import express from "express";
import { Error } from "mongoose";
import log4js, { Configuration } from "log4js";
import cors from "cors";
import * as dotenv from "dotenv";

import log4jsConfig from "./configs/log4js.config";
import { logRequests } from "./middlewares/requestLogger";
import { routes } from "./routes";
import connectDatabase from "./configs/db";

log4js.configure(log4jsConfig as Configuration);

const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.options("*", cors());
app.use(express.json());

app.use(logRequests);

routes(app);

const logger = log4js.getLogger();

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`Server listening on ${process.env.BASE_URL}`);
    });
  })
  .catch((error: Error) => {
    logger.error("Error connecting to the database", error);
    process.exit(1);
  });
