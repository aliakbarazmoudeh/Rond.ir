const { StatusCodes } = require('http-status-codes');
const { BadRequestError, NotFoundError } = require('../errors');
const { Op } = require('sequelize');
const Phone = require('../models/Phone');
const Iran = require('../commen/utils/iran');
const User = require('../models/User');
const createPayment = require('../commen/zarinpal/createPayment');
const verifyPayment = require('../commen/zarinpal/verifyPayment');

const addPhone = async (req, res) => {
  const owner = req.user;
  let {
    number,
    areaCode,
    phoneType,
    price,
    usage,
    status,
    rondType,
    termsOfSale,
    plan,
    discription,
  } = req.body;

  if (price < 10000 && price >= 3)
    throw new BadRequestError('pleas enter a valid price');

  const user = await User.findByPk(owner);
  if (user.dataValues.productCount === 0) {
    throw new BadRequestError('User cant add phone, has to buy premium');
  }

  const isSimExist = await Phone.findOne({ where: { number, areaCode } });
  if (isSimExist) {
    throw new BadRequestError('Phone already exist');
  }

  const phone = await Phone.create({
    number,
    owner,
    areaCode,
    phoneType,
    price,
    phoneType,
    price,
    usage,
    status,
    rondType,
    termsOfSale,
    plan,
    discription,
    payment: false,
  });
  let amount;
  phone.dataValues.plan === 1 ? (amount = 49000) : null;
  phone.dataValues.plan === 3 ? (amount = 89000) : null;
  phone.dataValues.plan === 5 ? (amount = 109000) : null;
  const payment = await createPayment(
    amount,
    owner,
    `http://localhost:${
      process.env.PORT || 5003
    }/api/phone/payments?productID=${phone.dataValues._id}&Amount=${amount}`
  );
  console.log(payment);
  res.status(StatusCodes.CREATED).redirect(payment.url);
};

const getAllPhones = async (req, res) => {
  let where = {};
  let orderArray = [
    ['plan', 'desc'],
    ['updatedAt', 'desc'],
  ];
  req.query.number
    ? (where.number = { [Op.like]: `%${req.query.number}%` })
    : null;
  req.query.areaCode ? (where.areaCode = req.query.areaCode.split(',')) : null;
  req.query.phoneType
    ? (where.phoneType = req.query.phoneType.split(','))
    : null;
  req.query.status ? (where.status = req.query.status.split(',')) : null;
  req.query.rondType ? (where.rondType = req.query.rondType.split(',')) : null;
  req.query.gte
    ? (where.price = {
        [Op.gte]: req.query.gte,
        [Op.lt]: req.query.lt || 1000000000000,
      })
    : null;
  req.query.lt
    ? (where.price = { [Op.lt]: req.query.lt, [Op.gte]: req.query.gte || 0 })
    : null;
  req.query.termsOfSale
    ? (where.termsOfSale = req.query.termsOfSale.split(','))
    : null;
  if (req.query.sort) {
    let temp = orderArray[0];
    let temp2 = orderArray[1];
    orderArray[0] = req.query.sort.split(',');
    orderArray[1] = temp;
    orderArray[2] = temp2;
  }
  const phones = await Phone.findAll({
    where: where,
    include: [
      {
        model: User,
        attributes: [
          'phoneNumber',
          'telephoneNumber',
          'companyName',
          'address',
        ],
      },
    ],
    order: orderArray,
    limit: parseInt(req.query.limit) || 10,
    offset: parseInt(req.query.offset) || 0,
  });
  res.status(StatusCodes.OK).json({ phones });
};

const getSinglePhone = async (req, res) => {
  const id = req.params.id;
  const phone = await Phone.findByPk(id, {
    include: [{ model: User }],
  });
  if (!phone) {
    throw new NotFoundError('cant find any phone with this id');
  }
  res.status(StatusCodes.OK).json({ phone });
};

const getAllPhonesFromUnkUser = async (req, res) => {
  const { owner } = req.body;
  const user = await User.findByPk(owner, {
    include: {
      model: Phone,
      order: [
        ['plan', 'desc'],
        ['updatedAt', 'desc'],
      ],
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    },
  });
  if (!user)
    throw new NotFoundError('cant find any data with this informations');
  res.status(StatusCodes.OK).json({ user });
};

const getAllUserPhones = async (req, res) => {
  const user = await User.findByPk(req.user, {
    include: {
      model: Phone,
      order: [
        ['plan', 'desc'],
        ['updatedAt', 'desc'],
      ],
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    },
  });
  if (!user)
    throw new NotFoundError('cant find any data with this informations');
  res.status(StatusCodes.OK).json({ user });
};

const updatePhone = async (req, res) => {
  const phone = await Phone.findOne({
    where: {
      number: req.body.number,
      areaCode: req.body.areaCode,
      owner: req.user,
    },
  });
  if (!phone) {
    throw new NotFoundError('cant find any phone with this informations');
  }
  phone.set(req.body);
  await phone.save({
    fields: [
      'number',
      'areaCode',
      'phoneType',
      'price',
      'usage',
      'status',
      'rondType',
      'termsOfSale',
      'plan',
      'discription',
    ],
  });
  res.status(StatusCodes.OK).json({ msg: 'phone updated successfully' });
};

const deletePhone = async (req, res) => {
  const phone = await Phone.findOne({
    where: {
      number: req.body.number,
      areaCode: req.body.areaCode,
      owner: req.user,
    },
  });
  if (!phone) {
    throw new NotFoundError('cant find any phone with this informations');
  }
  await phone.destroy();
  res.status(StatusCodes.OK).json({ msg: 'deleting phone number', phone });
};

const payment = async (req, res) => {
  const { productID, Amount, Authority, Status } = req.query;
  const product = await Phone.findByPk(productID);
  if (Status != 'OK') {
    await product.destroy();
    throw new BadRequestError('invalid payment, pleas try again');
  }
  const paymentInfo = await verifyPayment(Amount, Authority);
  if (
    !paymentInfo.RefID ||
    (paymentInfo.status < 100 && paymentInfo.status > 101)
  ) {
    await product.destroy();
    throw new BadRequestError('invalid payments, pleas try again later');
  }
  product.set({ payment: true });
  product.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: 'payment was successfull, congratulation!' });
};

module.exports = {
  addPhone,
  getAllPhones,
  getSinglePhone,
  getAllPhonesFromUnkUser,
  getAllUserPhones,
  updatePhone,
  deletePhone,
  payment,
};
