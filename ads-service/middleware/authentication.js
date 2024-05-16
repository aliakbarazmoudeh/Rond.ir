const CustomError = require("../errors");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.token;
  const role = req.signedCookies.role;
  if (!token || !role) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
  try {
    req.user = token;
    req.role = role;
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError("Authentication Invalid");
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.role)) {
      throw new CustomError.UnauthorizedError(
        "Unauthorized to access this route",
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
