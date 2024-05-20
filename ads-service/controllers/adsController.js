const Ad = require("../models/Ad");
const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const path = require("path");
const moment = require("moment");
const { BadRequestError, NotFoundError } = require("../errors");
const createPayment = require("../commen/zarinpal/createPayment");
const verifyPayment = require("../commen/zarinpal/verifyPayment");

const getAllAds = async (req, res) => {
  const ads = await Ad.findAll({
    where: { payment: true, submitted: true },
    order: [
      ["plan", "desc"],
      ["createdAt", "desc"],
    ],
    limit: parseInt(req.query.limit) || 20,
    offset: parseInt(req.query.offset) || 0,
  });
  res.status(StatusCodes.OK).json({ ads });
};

const getUserAds = async (req, res) => {
  const userAds = await Ad.findAll({
    where: { ownerID: req.user },
    order: [["createdAt", "desc"]],
  });
  if (!userAds) throw new NotFoundError("cant find any ads with this data");
  res.status(StatusCodes.OK).json(userAds);
};

const getAd = async (req, res) => {
  const { id } = req.body;
  const ad = await Ad.findByPk(id);
  if (!ad) {
    throw new NotFoundError("cant find any ads by this information");
  }
  res.status(StatusCodes.OK).json({ ad });
};

const createAd = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No File Uploaded");
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please Upload Image");
  }
  const maxSize = 512 * 512;
  if (productImage.size > maxSize) {
    throw new BadRequestError("Please upload image smaller 0.5MB");
  }
  const imagePath = path.join(__dirname, "../../ads/" + `${productImage.name}`);
  // await productImage.mv(imagePath);
  const ad = await Ad.create({
    ownerID: req.user,
    src: `/ads/${productImage.name}`,
    plan: parseInt(req.query.plan),
    expireAt: Date.now() + 259200000,
    payment: req.query.plan === 0,
    createdAt: parseInt(moment(Date.now()).format("YYYYMMDDHHmmss")),
  });
  if (req.query.plan !== 0) {
    let amount;
    ad.dataValues.plan === 1 ? (amount = 49000) : null;
    ad.dataValues.plan === 3 ? (amount = 89000) : null;
    ad.dataValues.plan === 5 ? (amount = 109000) : null;
    const payment = await createPayment(
      amount,
      ad.dataValues.ownerID,
      `http://localhost:${process.env.PORT || 5004}/api/ad/payments?productID=${
        ad.dataValues._id
      }&Amount=${amount}`,
    );
    console.log(payment);
    res
      .status(StatusCodes.OK)
      .json({ image: { src: `/ads/${productImage.name}` }, url: payment.url });
    return;
  }
  res
    .status(StatusCodes.OK)
    .json({ status: StatusCodes.CREATED, msg: "ad created successfully" });
};

const payment = async (req, res) => {
  const { productID, Amount, Authority, Status } = req.query;
  const product = await Ad.findByPk(productID);
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

const getAllAdsForAdmins = async (req, res) => {
  const ads = await Ad.findAll({
    where: { submitted: false, payment: true },
    order: [["createdAt", "asc"]],
  });
  res.status(StatusCodes.OK).json(ads);
};

const getSingleAdForAdmin = async (req, res) => {
  let { id } = req.params;

  const ad = await Ad.findByPk(id);
  if (!ad) {
    throw new NotFoundError("cant find any ads with this id");
  }
  res.status(StatusCodes.OK).json({ ad });
};

const adSubmission = async (req, res) => {
  const { id } = req.params;
  let ad = await Ad.findByPk(id);
  if (!ad) {
    throw new NotFoundError("cant find any ad with this id");
  }
  ad.set({ submitted: true });
  await ad.save();
  res
    .status(StatusCodes.OK)
    .json({ status: 200, msg: "ad submitted successfully" });
};

const adDisagreed = async (req, res) => {
  const { id } = req.params;
  let ad = await Ad.findByPk(id);
  if (!ad) {
    throw new NotFoundError("cant find any ad with this id");
  }
  await ad.destroy();
  res
    .status(StatusCodes.OK)
    .json({ status: 200, msg: "ad deleted successfully" });
};

module.exports = {
  getAllAds,
  getUserAds,
  getAd,
  createAd,
  getAllAdsForAdmins,
  getSingleAdForAdmin,
  adSubmission,
  adDisagreed,
  payment,
};
