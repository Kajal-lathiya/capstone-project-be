import createHttpError from "http-errors";
import UsersModel from "../../apis/users/model.js";

const adminOnlyMiddleware = async (req, res, next) => {
  //this req.user._id is coming from admin only middleware where we overwrite the user
  //if the credentials match
  const user = await UsersModel.findById(req.user._id);

  if (user.role.toString() === "admin") {
    next();
  } else {
    next(createHttpError(403, "This endpoint is available just for admins!"));
  }
};

export default adminOnlyMiddleware;
