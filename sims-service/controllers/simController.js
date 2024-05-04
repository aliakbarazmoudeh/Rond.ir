const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const { Op } = require('sequelize');
const Sim = require('../models/Sim');
const Iran = require('../commen/utils/iran');
const User = require('../models/User');
const createPayment = require('../commen/zarinpal/createPayment');
const verifyPayment = require('../commen/zarinpal/verifyPayment');

const addSim = async (req, res) => {
  const owner = req.user;
  let {
    phoneNumber,
    operator,
    price,
    priceType,
    status,
    simType,
    rondType,
    termsOfSale,
    province,
    city,
    plan,
    discription,
  } = req.body;

  if (!Iran[province].includes(city)) {
    throw new BadRequestError('invalid city and province');
  }

  if (
    (price == null || price == undefined || price < 10000) &&
    (priceType == null || priceType == undefined)
  )
    throw new BadRequestError('pleas enter a valid price');

  const user = await User.findByPk(owner);
  if (user.dataValues.productCount === 0) {
    throw new BadRequestError('User cant add sim card, has to buy premium');
  }

  const isSimExist = await Sim.findOne({ where: { phoneNumber } });
  if (isSimExist) {
    throw new BadRequestError('sim already exist');
  }

  const sim = await Sim.create({
    phoneNumber,
    owner,
    operator,
    price,
    status,
    simType,
    rondType,
    termsOfSale,
    plan,
    province,
    city,
    plan,
    discription,
    payment: false,
  });
  let amount;
  plan === 1 ? (amount = 49000) : null;
  plan === 3 ? (amount = 89000) : null;
  plan === 5 ? (amount = 109000) : null;
  const payment = await createPayment(
    amount,
    owner,
    `http://localhost:${process.env.PORT || 5001}/api/sim/payments?productID=${
      sim.dataValues.phoneNumber
    }&Amount=${amount}`
  );
  console.log(payment);
  res.status(StatusCodes.CREATED).redirect(payment.url);
};

const getAllSims = async (req, res) => {
  let where = {};
  req.query.operator ? (where.operator = req.query.operator.split(',')) : null;
  req.query.areaCode
    ? (where.phoneNumber = { [Op.startsWith]: `%${req.query.areaCode}%` })
    : null;
  req.query.number
    ? (where.phoneNumber = { [Op.like]: `%${req.query.number}%` })
    : null;
  req.query.phoneNumberType
    ? (where.phoneNumberType = req.query.phoneNumberType.split(','))
    : null;
  req.query.status ? (where.status = req.query.status.split(',')) : null;
  req.query.rondType ? (where.rondType = req.query.rondType.split(',')) : null;
  req.query.province ? (where.province = req.query.province) : null;
  req.query.city ? (where.city = req.query.city.split(',')) : null;
  req.query.gte
    ? (where.price = {
        [Op.gte]: req.query.gte,
        [Op.lt]: req.query.lt || 1000000000000,
      })
    : null;
  req.query.lt
    ? (where.price = { [Op.lt]: req.query.lt, [Op.gte]: req.query.gte || 0 })
    : null;
  const sims = await Sim.findAndCountAll({
    where: where,
    include: [
      {
        model: User,
        attributes: ['phoneNumber', 'telephoneNumber'],
      },
    ],
    order: [
      ['plan', 'desc'],
      ['updatedAt', 'desc'],
    ],
    limit: parseInt(req.query.limit) || null,
    offset: parseInt(req.query.offset) || null,
  });
  res.status(StatusCodes.OK).json({ sims });
};

const getSingleSim = async (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const sims = await Sim.findByPk(phoneNumber, {
    include: [{ model: User }],
  });
  if (!sims) {
    throw new NotFoundError('cant find any number with this phone number');
  }
  res.status(StatusCodes.OK).json({ sims });
};

const getAllSimsFromUnkUser = async (req, res) => {
  const { owner } = req.body;
  const user = await User.findByPk(owner, { include: { model: Sim } });
  if (!user)
    throw new NotFoundError('cant find any data with this informations');
  res.status(StatusCodes.OK).json({ user });
};

const getAllUserSims = async (req, res) => {
  const user = await User.findByPk(req.user, {
    include: {
      model: Sim,
      order: [
        ['plan', 'desc'],
        ['updatedAt', 'desc'],
      ],
      limit: parseInt(req.query.limit) || null,
      offset: parseInt(req.query.offset) || null,
    },
  });
  res.status(StatusCodes.OK).json({ user });
};

const updateSim = async (req, res) => {
  const sim = await Sim.findOne({
    where: { phoneNumber: req.body.phoneNumber, owner: req.user },
  });
  if (!sim) {
    throw new NotFoundError(
      'cant find any phone number with this informations'
    );
  }
  sim.set(req.body);
  await sim.save({
    fields: [
      'phoneNumber',
      'operator',
      'areaCode',
      'number',
      'price',
      'status',
      'phoneNumberType',
      'rondType',
      'termsOfSale',
      'level',
      'province',
      'city',
      'discription',
    ],
  });
  res.status(StatusCodes.OK).json({ sim });
};

const deleteSim = async (req, res) => {
  const sim = await Sim.findOne({
    where: { phoneNumber: req.body.phoneNumber, owner: req.user },
  });
  if (!sim) {
    throw new NotFoundError('cant find any sim with this informations');
  }
  await sim.destroy();
  res.status(StatusCodes.OK).json({ sim });
};

const payment = async (req, res) => {
  const { productID, Amount, Authority, Status } = req.query;
  if (Status != 'OK') {
    throw new BadRequestError('invalid payment, pleas try again');
  }
  const product = await Sim.findByPk(productID);
  const paymentInfo = await verifyPayment(Amount, Authority);
  if (
    !paymentInfo.RefID ||
    (paymentInfo.status < 100 && paymentInfo.status > 101)
  ) {
    throw new BadRequestError('invalid payments, pleas try again later');
  }
  product.set({ payment: true });
  product.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: 'payment was successfull, congratulation!' });
};

module.exports = {
  addSim,
  getAllSims,
  getSingleSim,
  getAllSimsFromUnkUser,
  getAllUserSims,
  updateSim,
  deleteSim,
  payment,
};
