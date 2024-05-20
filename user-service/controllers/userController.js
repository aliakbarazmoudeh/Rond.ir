const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
  UnauthorizedError,
} = require("../errors");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Iran = require("../commen/utils/iran");
const { publishDirectMessage } = require("../queues/producer");

const createUser = async (req, res) => {
  const {
    phoneNumber,
    userType,
    firstName,
    lastName,
    email,
    nationalCode,
    city,
    province,
    password,
    companyName,
    nationalId,
    address,
    registrationCode,
    postalCode,
    telephoneNumber,
  } = req.body;
  if (userType !== "Customer" && userType !== "Legal") {
    throw new BadRequestError("invalid user type");
  }
  if (
    userType === "Legal" &&
    !(
      nationalCode &&
      city &&
      province &&
      password &&
      companyName &&
      nationalId &&
      address &&
      registrationCode &&
      postalCode &&
      telephoneNumber
    )
  ) {
    throw new BadRequestError("'invalid information's for creating account");
  }
  // searching in both tables (legal users & normal users)
  let isUserExist = await User.findOne({ where: { phoneNumber } });
  if (isUserExist) {
    throw new BadRequestError("user already exist");
  }

  if (password.length > 16 || password.length < 8) {
    throw new BadRequestError("pleas enter a valid password");
  }
  if (!Iran[province].includes(city)) {
    throw new BadRequestError("invalid city and province");
  }
  const user = await User.create({
    phoneNumber,
    userType,
    firstName,
    lastName,
    email,
    nationalCode,
    city,
    province,
    password,
    companyName,
    nationalId,
    address,
    registrationCode,
    postalCode,
    telephoneNumber,
  });
  delete user.dataValues.password;
  const message = {
    id: user.dataValues.id,
    phoneNumber,
    address,
    telephoneNumber,
    firstName,
    lastName,
    companyName,
    productCount: 10,
    userType: user.dataValues.userType,
  };
  await publishDirectMessage("User", "register", message);
  res
    .cookie("token", user.dataValues.id, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 100000000),
      maxAge: new Date(Date.now() + 100000000),
      signed: true,
    })
    .cookie("role", user.dataValues.userType, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 100000000),
      maxAge: new Date(Date.now() + 100000000),
      signed: true,
    })
    .status(StatusCodes.CREATED)
    .json({
      status: StatusCodes.CREATED,
      msg: "user created successfully",
    });
};

const createAdmin = async (req, res) => {
  const { phoneNumber, firstName, lastName, password, privetKey } = req.body;
  if (!(phoneNumber && firstName && lastName && password && privetKey)) {
    throw new BadRequestError("pleas provide a valid information's");
  }
  if (privetKey !== process.env.privetKeyForAdminPanel) {
    throw new BadRequestError("pleas provide a valid information's");
  }
  const admin = await User.create({
    phoneNumber,
    firstName,
    lastName,
    password,
    userType: "Admin",
  });
  res
    .cookie("token", admin.dataValues.id, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 100000000),
      maxAge: new Date(Date.now() + 100000000),
      signed: true,
    })
    .cookie("role", admin.dataValues.userType, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 100000000),
      maxAge: new Date(Date.now() + 100000000),
      signed: true,
    })
    .status(StatusCodes.CREATED)
    .json({ status: 201, msg: "account created successfully" });
};

const login = async (req, res) => {
  const { phoneNumber, password } = req.body;
  let user = await User.findOne({ where: { phoneNumber } });
  if (!user) {
    throw new NotFoundError("cant find any user with this phone number");
  }
  const isMatch = await bcrypt.compare(password, user.dataValues.password);
  if (!isMatch) {
    throw new UnauthorizedError("password does not matched");
  }
  res
    .cookie("token", user.dataValues.id, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 100000000),
      maxAge: new Date(Date.now() + 100000000),
      signed: true,
    })
    .cookie("role", user.dataValues.userType, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 100000000),
      maxAge: new Date(Date.now() + 100000000),
      signed: true,
    })
    .status(StatusCodes.OK)
    .json({
      user,
      status: StatusCodes.OK,
      msg: "user longed in successfully",
    });
};

const logOut = async (req, res) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1),
  });
  res.cookie("role", "logout", {
    httpOnly: true,
    expires: new Date(Date.now() + 1),
  });
  res.status(StatusCodes.OK).json({ msg: "user logged out!" });
};

const currenUser = async (req, res) => {
  let user = await User.findByPk(req.user, {
    attributes: { exclude: ["password"] },
  });
  if (!user) {
    throw new UnauthenticatedError("Unauthenticated User");
  }
  res.status(StatusCodes.OK).json({ user });
};

const getSingleUser = async (req, res) => {
  let user = await User.findByPk(req.params.id, {
    attributes: {
      exclude: ["password"],
    },
  });
  if (!user) {
    throw new NotFoundError("cant find any user with this information's");
  }
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  let user = await User.findByPk(req.user);
  if (!user) {
    throw new NotFoundError("cant find any user with this information's");
  }
  req.body.id ? delete req.body.id : null;
  req.body.userType ? delete req.body.userType : null;
  req.body.productCount ? delete req.body.productCount : null;
  let data = req.body;
  data.id = req.user;
  await publishDirectMessage("User", "update", data);
  user.set(req.body);
  await user.save();
  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  let user = await User.findByPk(req.user);
  if (!user) {
    throw new NotFoundError("cant find any user with this phone number");
  }
  await publishDirectMessage("User", "delete", { id: req.user });
  await user.destroy();
  res
    .cookie("token", "logout", {
      httpOnly: true,
      expires: new Date(Date.now() + 1),
    })
    .cookie("role", "logout", {
      httpOnly: true,
      expires: new Date(Date.now() + 1),
    })
    .status(StatusCodes.OK)
    .json({ user });
};

module.exports = {
  createUser,
  createAdmin,
  login,
  logOut,
  currenUser,
  updateUser,
  deleteUser,
  getSingleUser,
};
