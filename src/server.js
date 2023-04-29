import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import usersRouter from "./apis/users/index.js";
import adminsRouter from "./apis/admin/index.js";

import {
  badRequestHandler,
  forbiddenHandler,
  genericErrorHAndler,
  unauthorizedHandler,
  notFoundHandler,
} from "./errorHandlers.js";
import listEndpoints from "express-list-endpoints";
import cartRouter from "./apis/users/cartRouter.js";
import ProductsRouter from "./apis/users/productsRoutes.js";
import paymentRouter from "./apis/users/paymentRouter.js";

const server = express();

const port = process.env.PORT || 3001;

//MIDDLEWARES

server.use(cors());
server.use(express.json());

//ENDPOINTS

server.use("/users", usersRouter);
server.use("/admin", adminsRouter);
server.use("/products", ProductsRouter);
server.use("/cart", cartRouter);
server.use("/payment", paymentRouter);


//ERROR HANDLERS
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(forbiddenHandler);
server.use(notFoundHandler);  
server.use(genericErrorHAndler);

mongoose.set("strictQuery", true);
mongoose.connect(process.env.MONGO_URL);

mongoose.connection.on("connected", () => {
  console.log("Connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server is running on port: ${port}`);
  });
});
