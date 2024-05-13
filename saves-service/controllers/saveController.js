const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');
const Save = require('../models/Save');
const User = require('../models/User');

// have checked order array

const addSaveMessage = async (req, res) => {
  const owner = req.user;
  const { title, plan, termOfSale, service, price } = req.body;
  const isExist = await Save.findOne({ where: { title, owner } });
  if (isExist) {
    throw new BadRequestError('save message already created');
  }

  const save = await Save.create({
    title,
    plan,
    price,
    service,
    termOfSale,
    owner,
  });

  res.status(StatusCodes.CREATED).json({
    save,
    status: StatusCodes.CREATED,
    msg: 'added to save message successfully',
  });
};

const getAllUserSaveMessage = async (req, res) => {
  const user = await User.findByPk(req.user, {
    include: [{ model: Save, order: ['createdAt', 'desc'] }],
  });
  if (!user) {
    throw new NotFoundError("cant find any data with this information's");
  }
  res.status(StatusCodes.OK).json({ user });
};

const deleteSaveMessage = async (req, res) => {
  const owner = req.user;
  const save = await Save.findByPk(req.body.id);
  if (!save) {
    throw new NotFoundError('cant find any domain with this credentials');
  }
  if (save.dataValues.owner !== owner) {
    throw new UnauthorizedError('invalid credentials');
  }
  await save.destroy();
  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    msg: 'save message deleted successfully',
  });
};

module.exports = {
  addSaveMessage,
  deleteSaveMessage,
  getAllUserSaveMessage,
};
