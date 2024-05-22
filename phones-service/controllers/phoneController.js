const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { Op } = require("sequelize");
const Phone = require("../models/Phone");
const User = require("../models/User");
const moment = require("moment");
const createPayment = require("../commen/zarinpal/createPayment");
const verifyPayment = require("../commen/zarinpal/verifyPayment");

const addPhone = async (req, res) => {
  const ownerID = req.user;
  let {
    number,
    preCode,
    phoneType,
    price,
    usage,
    status,
    rondType,
    termsOfSale,
    plan,
    description,
  } = req.body;
  price = parseInt(price);
  if (price < 10000 && price >= 3)
    throw new BadRequestError("pleas enter a valid price");

  const user = await User.findByPk(ownerID);
  if (user.dataValues.productCount === 0) {
    throw new BadRequestError("User cant add phone, has to buy premium");
  }

  const isSimExist = await Phone.findOne({ where: { number, preCode } });
  if (isSimExist) {
    throw new BadRequestError("Phone already exist");
  }

  const phone = await Phone.create({
    number,
    ownerID,
    preCode,
    phoneType,
    price,
    usage,
    status,
    rondType,
    termsOfSale,
    plan,
    description,
    expireAt: Date.now() + 864000000,
    payment: plan === 0,
    createdAt: parseInt(moment(Date.now()).format("YYYYMMDDHHmmss")),
  });
  if (plan !== 0) {
    let amount;
    phone.dataValues.plan === 1 ? (amount = 49000) : null;
    phone.dataValues.plan === 3 ? (amount = 89000) : null;
    phone.dataValues.plan === 5 ? (amount = 109000) : null;
    const payment = await createPayment(
      amount,
      owner,
      `http://localhost:${
        process.env.PORT || 5003
      }/api/phone/payments?productID=${phone.dataValues._id}&Amount=${amount}`,
    );
    console.log(payment);
    res.status(StatusCodes.CREATED).redirect(payment.url);
  }
  res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    msg: "phone created successfully, congratulation !",
  });
};

const getAllPhones = async (req, res) => {
  let where = {
    payment: true,
  };

  req.query.number
    ? (where.number = {
        [Op.regexp]: `^${req.query.number}$`,
      })
    : null;
  req.query.preCode ? (where.preCode = req.query.preCode.split(",")) : null;
  req.query.phoneType
    ? (where.phoneType = req.query.phoneType.split(","))
    : null;
  req.query.status ? (where.status = req.query.status.split(",")) : null;
  req.query.rondType ? (where.rondType = req.query.rondType.split(",")) : null;
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
    ? (where.termsOfSale = req.query.termsOfSale.split(","))
    : null;
  // initialize ordering for default mode
  let orderArray = [
    ["plan", "desc"],
    ["createdAt", "desc"],
  ];
  if (req.query.sort) {
    // swapping orders by their priority
    orderArray.unshift(req.query.sort.split(",")); // example : http://localhost:5000/phone?sort=price,desc
  }
  const phones = await Phone.findAndCountAll({
    where: where,
    order: orderArray,
    limit: parseInt(req.query.limit) || 10,
    offset: parseInt(req.query.offset) || 0,
  });
  res.status(StatusCodes.OK).json({ phones });
};

const getSinglePhone = async (req, res) => {
  const id = req.params.id;
  const phone = await Phone.findByPk(id, {
    include: [
      {
        model: User,
        include: [
          {
            model: Phone,
          },
        ],
      },
    ],
  });
  if (!phone) {
    throw new NotFoundError("cant find any phone with this id");
  }
  res.status(StatusCodes.OK).json({ phone });
};

const getAllUserPhones = async (req, res) => {
  const user = await User.findByPk(req.params.phoneNumber, {
    include: {
      model: Phone,
      order: [
        ["plan", "desc"],
        ["createdAt", "desc"],
      ],
      limit: parseInt(req.query.limit) || 10,
      offset: parseInt(req.query.offset) || 0,
    },
  });
  if (!user)
    throw new NotFoundError("cant find any data with this information's");
  res.status(StatusCodes.OK).json({ user });
};

const updatePhone = async (req, res) => {
  const phone = await Phone.findOne({
    where: {
      _id: req.params.id,
      ownerID: req.user,
    },
  });
  if (!phone) {
    throw new NotFoundError("cant find any phone with this information's");
  }
  phone.set(req.body);
  await phone.save({
    fields: [
      "number",
      "preCode",
      "phoneType",
      "price",
      "usage",
      "status",
      "rondType",
      "termsOfSale",
      "plan",
      "description",
    ],
  });
  res.status(StatusCodes.OK).json({ msg: "phone updated successfully" });
};

const deletePhone = async (req, res) => {
  const phone = await Phone.findOne({
    where: {
      _id: req.params.id,
      ownerID: req.user,
    },
  });
  if (!phone) {
    throw new NotFoundError("cant find any phone with this information's");
  }
  await phone.destroy();
  res.status(StatusCodes.OK).json({ msg: "deleting phone number", phone });
};

const payment = async (req, res) => {
  const { productID, Amount, Authority, Status } = req.query;
  const product = await Phone.findByPk(productID);
  if (Status !== "OK") {
    await product.destroy();
    throw new BadRequestError("invalid payment, pleas try again");
  }
  const paymentInfo = await verifyPayment(Amount, Authority);
  if (
    !paymentInfo.RefID ||
    (paymentInfo.status < 100 && paymentInfo.status > 101)
  ) {
    await product.destroy();
    throw new BadRequestError("invalid payments, pleas try again later");
  }
  product.set({ payment: true });
  await product.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "payment was successfully, congratulation!" });
};

module.exports = {
  addPhone,
  getAllPhones,
  getSinglePhone,
  getAllUserPhones,
  updatePhone,
  deletePhone,
  payment,
};
