import express from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import usersRouter from "./apis/users/index.js";
import productRouter from "./apis/products/index.js";
import cartRouter from "./apis/cart/index.js";
import paymentRouter from "./apis/placeOrder/index.js";

import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHAndler,
  notFoundHandler,
  unauthorizedHandler
} from "./errorHandlers.js";
import cookieParser from "cookie-parser";

const server = express();

const port = process.env.PORT || 3001;

//middlewares

server.use(cors());
server.use(express.json());
server.use(cookieParser());

//endpoints

server.use("/users", usersRouter);
server.use("/products", productRouter);
server.use("/cart", cartRouter);
server.use("/checkout", paymentRouter);

//error handlers

server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);
server.use(genericErrorHAndler);

mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port: ${port}`);
  });
});
