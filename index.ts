import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import config from "./config";
import authRouter from "./routes/auth";
import beeGardenRouter from "./routes/beeGarden";
import beeHaveRouter from "./routes/beeHave";
import eventRouter from "./routes/event";

const app = express();

app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRouter);
app.use(beeGardenRouter);
app.use(beeHaveRouter);
app.use("/event", eventRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message;
  const data = error.data || "Unexpected server error";
  res.status(status).json({ message: message, data });
});

const connectDB = async () => {
  try {
    const { connection } = await mongoose.connect(config.DB_CONNECT);
    console.log(`🚀 Mongo connected: ${connection.host}`);
    app.listen(8080);
  } catch (err) {
    console.log(err);
  }
};

connectDB();
