const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require('../errors');
const User = require('../models/User');
const LegalUser = require('../models/legalUser');
const bcrypt = require('bcryptjs');
const Iran = require('../commen/utils/iran');
const { publishDirectMessage } = require('../queues/producer');

const legalUserRegister = async (req, res) => {
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
    registerationCode,
    postalCode,
    telephoneNumber,
  } = req.body;

  // searching in both tables (legal users & normal users)
  let isUserExist = await LegalUser.findByPk(phoneNumber);
  if (!isUserExist) {
    isUserExist = await User.findByPk(phoneNumber);
    if (isUserExist)
      throw new BadRequestError('user cant have acount in difference roles');
  } else throw new BadRequestError('user already exist');

  if (password.length > 16 || password.length < 8) {
    throw new BadRequestError('pleas enter a valid password');
  }
  if (!Iran[province].includes(city)) {
    throw new BadRequestError('invalid city and province');
  }
  const user = await LegalUser.create({
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
    registerationCode,
    postalCode,
    telephoneNumber,
  });
  delete user.dataValues.password;
  const message = {
    phoneNumber,
    address,
    telephoneNumber,
    firstName,
    lastName,
    companyName,
    productCount: 2,
    userLevel: 1,
  };
  await publishDirectMessage('User', 'register', message);
  res
    .cookie('token', user.dataValues.phoneNumber, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 100000000),
      maxAge: new Date(Date.now() + 100000000),
      signed: true,
    })
    .status(StatusCodes.CREATED)
    .json({
      user,
      status: StatusCodes.CREATED,
      msg: 'user created successfuly',
    });
};

const registerNormalUser = async (req, res) => {
  const {
    phoneNumber,
    firstName,
    lastName,
    email,
    nationalCode,
    city,
    province,
    password,
  } = req.body;

  // searching in both tables (legal users & normal users)
  let isUserExist = await User.findByPk(phoneNumber);
  if (!isUserExist) {
    isUserExist = await LegalUser.findByPk(phoneNumber);
    if (isUserExist)
      throw new BadRequestError('user cant have acount in difference roles');
  } else throw new BadRequestError('user already exist');

  if (password.length > 16 || password.length < 8) {
    throw new BadRequestError('pleas enter a valid password');
  }
  if (!Iran[province].includes(city)) {
    throw new BadRequestError('invalid city and province');
  }
  const user = await User.create({
    phoneNumber,
    firstName,
    lastName,
    email,
    nationalCode,
    city,
    province,
    password,
  });
  delete user.dataValues.password;
  const message = {
    phoneNumber,
    address: null,
    firstName,
    lastName,
    telephoneNumber: null,
    productCount: 2,
    userLevel: 1,
  };
  await publishDirectMessage('User', 'register', message);
  res
    .cookie('token', user.dataValues.phoneNumber, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 100000000),
      maxAge: new Date(Date.now() + 100000000),
      signed: true,
    })
    .status(StatusCodes.CREATED)
    .json({
      user,
      status: StatusCodes.CREATED,
      msg: 'user created successfuly',
    });
};

const login = async (req, res) => {
  const { phoneNumber, password } = req.body;
  let user = await User.findByPk(phoneNumber);
  if (!user) {
    user = await LegalUser.findByPk(phoneNumber);
    if (!user) {
      throw new NotFoundError('cant find any user with this phone number');
    }
  }
  const isMatch = await bcrypt.compare(password, user.dataValues.password);
  if (!isMatch) {
    throw new UnauthorizedError('password does not matched');
  }
  res
    .cookie('token', user.dataValues.phoneNumber, {
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
      msg: 'user loged in successfuly',
    });
};

const logOut = async (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now() + 1),
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

const currenUser = async (req, res) => {
  let user = await User.findByPk(req.user, {
    attributes: { exclude: ['password'] },
  });
  if (!user) {
    user = await LegalUser.findByPk(req.user, {
      attributes: { exclude: ['password'] },
    });
    if (!user) {
      throw new UnauthenticatedError('Unauthenticated User');
    }
  }
  res.status(StatusCodes.OK).json({ user });
};

const getSingleUser = async (req, res) => {
  let user = await User.findByPk(req.params.id, {
    attributes: {
      exclude: ['password'],
    },
  });
  if (!user) {
    user = await LegalUser.findByPk(req.params.id);
    if (!user) {
      throw new NotFoundError('cant find any user with this informations');
    }
  }
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  let user = await User.findOne({ where: { phoneNumber: req.user } });
  if (!user) {
    user = await LegalUser.findOne({ where: { phoneNumber: req.user } });
    if (!user) {
      throw new NotFoundError('cant find any user with this informations');
    }
  }
  let data = req.body;
  data.phoneNumber = req.user;
  await publishDirectMessage('User', 'update', data);
  await user.save();
  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  let user = await User.findOne({ where: { phoneNumber: req.user } });
  if (!user) {
    user = await LegalUser.findOne({ where: { phoneNumber: req.user } });
    if (!user) {
      throw new NotFoundError('cant find any user with this phone number');
    }
  }
  await publishDirectMessage('User', 'delete', { phoneNumber: req.user });
  await user.destroy();
  res
    .cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now() + 1),
    })
    .status(StatusCodes.OK)
    .json({ user });
};

module.exports = {
  legalUserRegister,
  registerNormalUser,
  login,
  logOut,
  currenUser,
  updateUser,
  deleteUser,
  getSingleUser,
};
