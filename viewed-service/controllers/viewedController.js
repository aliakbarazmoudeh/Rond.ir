const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");
const Viewed = require("../models/Viewed");
const User = require("../models/User");

const addViewedPost = async (req, res) => {
  const owner = req.user;
  const { title, plan, termOfSale, service, price } = req.body;
  const isExist = await Viewed.findOne({ where: { title, owner } });
  if (isExist) {
    throw new BadRequestError("viewed post already added");
  }

  const viewedPost = await Viewed.create({
    title,
    plan,
    price,
    service,
    termOfSale,
    owner,
    expireAt: Date.now() + 259200000,
    createdAt: parseInt(moment(Date.now()).format("YYYYMMDDHHmmss")),
  });

  res.status(StatusCodes.CREATED).json({
    status: StatusCodes.CREATED,
  });
};

const getAllViewedPostsByUser = async (req, res) => {
  const user = await User.findByPk(req.user, {
    include: [{ model: Viewed, order: ["createdAt", "desc"] }],
  });
  if (!user) {
    throw new NotFoundError("cant find any data with this informations");
  }
  res.status(StatusCodes.OK).json({ viewedPost: user.dataValues.Vieweds });
};

module.exports = {
  addViewedPost,
  getAllViewedPostsByUser,
};
