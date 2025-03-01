import { Express } from "express";
import destination from "./destination";
import user from "./user";

export const v1Apis = function (app: Express) {
  app.use("/api/v1/destination", destination);
  app.use("/api/v1/user", user);
};
