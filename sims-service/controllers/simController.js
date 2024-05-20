const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const { Op } = require("sequelize");
const Sim = require("../models/Sim");
const Iran = require("../commen/utils/iran");
const User = require("../models/User");
const moment = require("moment");
const createPayment = require("../commen/zarinpal/createPayment");
const verifyPayment = require("../commen/zarinpal/verifyPayment");

// TODO [] - clean the payment service
// TODO [] - add free option for products

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
    description,
  } = req.body;
  price = parseInt(price); // avoiding for float numbers to store
  if (!Iran[province].includes(city)) {
    throw new BadRequestError("invalid city and province");
  }

  if (
    (price === null || price === undefined || price < 10000) &&
    (priceType === null || priceType === undefined)
  )
    throw new BadRequestError("pleas enter a valid price");

  const user = await User.findByPk(owner);
  if (user.dataValues.productCount === 0) {
    throw new BadRequestError("User cant add sim card, has to buy premium");
  }

  const isSimExist = await Sim.findByPk(phoneNumber);
  if (isSimExist) {
    throw new BadRequestError("sim already exist");
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
    expireAt: Date.now() + 864000000,
    description,
    payment: plan === 0, // for free option return true
    createdAt: parseInt(moment(Date.now()).format("YYYYMMDDHHmmss")),
  });
  if (plan !== 0) {
    let amount;
    plan === 1 ? (amount = 49000) : null;
    plan === 3 ? (amount = 89000) : null;
    plan === 5 ? (amount = 109000) : null;
    const payment = await createPayment(
      amount,
      owner,
      `http://localhost:${process.env.PORT || 5001}/api/sim/payments?productID=${
        sim.dataValues.phoneNumber
      }&Amount=${amount}`,
    );
    console.log(payment);
    res.status(StatusCodes.CREATED).redirect(payment.url);
  }
  res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
    msg: "Sim card created successfully, congratulation!",
  });
};

const getAllSims = async (req, res) => {
  let where = {
    payment: true,
  };
  req.query.operator ? (where.operator = req.query.operator.split(",")) : null;
  req.query.areaCode
    ? (where.phoneNumber = { [Op.startsWith]: `%${req.query.areaCode}%` })
    : null;
  req.query.number
    ? (where.phoneNumber = { [Op.like]: `%${req.query.number}%` })
    : null;
  req.query.phoneNumberType
    ? (where.phoneNumberType = req.query.phoneNumberType.split(","))
    : null;
  req.query.status ? (where.status = req.query.status.split(",")) : null;
  req.query.rondType ? (where.rondType = req.query.rondType.split(",")) : null;
  req.query.province ? (where.province = req.query.province) : null;
  req.query.city ? (where.city = req.query.city.split(",")) : null;
  req.query.gte
    ? (where.price = {
        [Op.gte]: req.query.gte,
        [Op.lt]: req.query.lt || 1000000000000,
      })
    : null;
  req.query.lt
    ? (where.price = { [Op.lt]: req.query.lt, [Op.gte]: req.query.gte || 0 })
    : null;
  let orderArray = [
    ["plan", "desc"],
    ["createdAt", "desc"],
  ];
  if (req.query.sort) {
    // swapping orders by their priority
    orderArray.unshift(req.query.sort.split(",")); // example : http://localhost:5000/sim?sort=price,desc
  }
  const sims = await Sim.findAndCountAll({
    where: where,
    include: [
      {
        model: User,
        attributes: ["phoneNumber", "telephoneNumber"],
      },
    ],
    order: orderArray,
    limit: parseInt(req.query.limit) || 10,
    offset: parseInt(req.query.offset) || 0,
  });
  res.status(StatusCodes.OK).json({ sims });
};

const getSingleSim = async (req, res) => {
  const phoneNumber = req.params.phoneNumber;
  const sims = await Sim.findByPk(phoneNumber, {
    include: [{ model: User }],
  });
  if (!sims) {
    throw new NotFoundError("cant find any number with this phone number");
  }
  res.status(StatusCodes.OK).json({ sims });
};

const getAllSimsFromUnkUser = async (req, res) => {
  const { owner } = req.body;
  const user = await User.findByPk(owner, { include: { model: Sim } });
  if (!user)
    throw new NotFoundError("cant find any data with this information's");
  res.status(StatusCodes.OK).json({ user });
};

const getAllUserSims = async (req, res) => {
  // using req.user for authentication assurance
  const user = await User.findByPk(req.user, {
    include: {
      model: Sim,
      order: [
        ["plan", "desc"],
        ["updatedAt", "desc"],
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
      "cant find any phone number with this information's",
    );
  }
  sim.set(req.body);
  await sim.save({
    fields: [
      "phoneNumber",
      "operator",
      "areaCode",
      "number",
      "price",
      "status",
      "phoneNumberType",
      "rondType",
      "termsOfSale",
      "level",
      "province",
      "city",
      "description",
    ],
  });
  res
    .status(StatusCodes.OK)
    .json({ status: StatusCodes.OK, msg: "sim updated successfully" });
};

const deleteSim = async (req, res) => {
  const sim = await Sim.findOne({
    where: { phoneNumber: req.body.phoneNumber, owner: req.user },
  });
  if (!sim) {
    throw new NotFoundError("cant find any sim with this information's");
  }
  await sim.destroy();
  res
    .status(StatusCodes.OK)
    .json({ status: StatusCodes.OK, msg: "sim deleted successfully" });
};

const payment = async (req, res) => {
  const { productID, Amount, Authority, Status } = req.query;
  if (Status !== "OK") {
    throw new BadRequestError("invalid payment, pleas try again");
  }
  const product = await Sim.findByPk(productID);
  const paymentInfo = await verifyPayment(Amount, Authority);
  if (
    !paymentInfo.RefID ||
    (paymentInfo.status < 100 && paymentInfo.status > 101)
  ) {
    throw new BadRequestError("invalid payments, pleas try again later");
  }
  product.set({ payment: true });
  await product.save();
  res.status(StatusCodes.OK).json({
    status: StatusCodes.OK,
    msg: "payment was successfully, congratulation!",
  });
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
