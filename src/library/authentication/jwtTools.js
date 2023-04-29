import jwt from "jsonwebtoken";

const options = { expiresIn: `1 week` };

export const createAccessToken = (payload) => {
  return new Promise((resolve, reject) => {
    return jwt.sign(payload, process.env.JWT_SECRET, options, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    });
  });
};

export const verifyAccessToken = (token) => {
  return new Promise((resolve, reject) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, originalPayload) => {
      if (err) reject(err);
      else resolve(originalPayload);
    });
  });
};
