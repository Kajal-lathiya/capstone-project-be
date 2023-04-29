import express from "express";
import jwt from "jsonwebtoken";
import AdminsModel from "./model.js";
import { JWTAuthMiddleware } from "../../library/authentication/jwtAuth.js";
import { createAccessToken } from "../../library/authentication/jwtTools.js";

import { ExtractJwt } from "passport-jwt";

const adminRouter = express.Router();
const adminSecret = process.env.ADMIN_SECRET_KEY;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
jwtOptions.secretOrKey = adminSecret;

// var ordersController = require("../controllers/ordersController");

// const authorizationAdminToken = (req, res, next) => {
//   const authorizationHeader = req.headers["authorization"];
//   const postedToken = authorizationHeader.split(" ")[1];
//   if (!postedToken) {
//     res.status(401);
//   }
//   jwt.verify(postedToken, adminSecret, (err, data) => {
//     if (err) {
//       next(err);
//     } else {
//       next();
//     }
//   });
// };

// adminRouter.get(
//   "/orders",
//   JWTAuthMiddleware,
//   ordersController.showAllOrders
// );

adminRouter.post("/register", async (req, res, next) => {
  try {
    const name = req.body.name.toString().trim();
    const email = req.body.email.toString().trim();
    const password = req.body.password.toString();
    const newAdmin = new AdminsModel({
      name,
      email,
      password
    });
    const { _id } = await newAdmin.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

adminRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Obtain the credentials from req.body
    const { email, password } = req.body;

    // 2. Verify the credentials
    const admin = await AdminsModel.checkCredentials(email, password);

    if (admin) {
      // 3.1 If credentials are fine --> generate an access token (JWT) and send it back as a response
      const payload = { _id: admin._id, role: admin.role };

      const accessToken = await createAccessToken(payload);
      res.send({ _id: admin._id, accessToken });
    } else {
      // 3.2 If credentials are NOT fine --> trigger a 401 error
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

// router.post("/", authorizationToken, ordersController.createOrder);

export default adminRouter;
