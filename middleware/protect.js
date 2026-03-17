const jwt = require("jsonwebtoken");

const verifyAdmin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    const token = authorization.startsWith("Bearer ")
      ? authorization.substring(7)
      : authorization;

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).send({
          message: "Not authorized",
        });
        return;
      }

      console.log(decoded);

      req.admin = decoded;

      next();
    });
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      message: "Not authorized bcuz of network",
    });
  }
};

module.exports = { verifyAdmin };
