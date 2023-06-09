import express from "express";
import UsersModel from "./model.js";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../../library/authentication/jwtAuth.js";
import { createAccessToken } from "../../library/authentication/jwtTools.js";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      format: "jpeg",
      folder: "capstone-project"
    }
  })
}).single("avatar");

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const emailAlreadyRegistered = await UsersModel.findOne({ email: email });
    if (emailAlreadyRegistered) {
      return next(
        createHttpError(400, `User with provided email already exists`)
      );
    }
    const newUser = new UsersModel(req.body);
    await newUser.save();
    if (
      (newUser && email && password && firstName && lastName) ||
      (newUser && email && password && firstName && lastName && avatar)
    ) {
      const payload = { _id: newUser._id, role: newUser.role };

      const accessToken = await createAccessToken(payload);
      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.status(201).send({ user: newUser });
      // res.status(201).send();
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);
    if (user) {
      const payload = { _id: user._id };
      const accessToken = await createAccessToken(payload);
      res.cookie("accessToken", accessToken, { httpOnly: true });
      res.send({ accessToken, user: user });
    } else {
      next(createHttpError(401, "Credentials are not OK!"));
    }
  } catch (error) {
    console.log("Error during log in");
    next(error);
  }
});

usersRouter.post(
  "/:userId/avatar",
  cloudinaryUploader,
  async (req, res, next) => {
    try {
      //we get from req.body the picture we want to upload
      console.log("ID: ", req.params.userId);
      const url = req.file.path;
      console.log("URL", url);
      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        { avatar: url },
        { new: true, runValidators: true }
      );
      console.log(updatedUser);
      if (updatedUser) {
        res.status(200).send(updatedUser);
      } else {
        next(
          createHttpError(404, `User with id ${req.params.userId} not found`)
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

usersRouter.get("/me/:userId", async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    res.send({ user: user });
  } catch (error) {
    next(error);
  }
});

// usersRouter.put("/me", JWTAuthMiddleware, async (req, res, next) => {
//   try {
//     const user = await UsersModel.findById(req.user._id);
//     if (user) {
//       const updatedUser = await UsersModel.findByIdAndUpdate(
//         req.user._id,
//         req.body,
//         { new: true, runValidators: true }
//       );
//       res.status(200).send(updatedUser);
//     } else {
//       next(createHttpError(404, `User with the provided id not found`));
//     }
//   } catch (error) {
//     next(error);
//   }
// });
// update userprofile
usersRouter.put("/:userId", async (req, res, next) => {
  console.log("req.body--->", req.body);
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) {
      const updatedUser = await UsersModel.findByIdAndUpdate(
        req.params.userId,
        req.body,
        { new: true, runValidators: true }
      );
      res.status(200).send(updatedUser);
    } else {
      next(createHttpError(404, `User with ${req.params.userId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default usersRouter;
