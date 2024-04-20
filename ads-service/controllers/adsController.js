const Ad = require('../models/Ad');
const { StatusCodes } = require('http-status-codes');
const path = require('path');
const { BadRequestError, NotFoundError } = require('../errors');

const getAllAds = async (req, res) => {
  const ads = await Ad.findAll({
    order: [
      ['plan', 'desc'],
      ['updatedAt', 'desc'],
    ],
    limit: parseInt(req.query.limit) || null,
    offset: parseInt(req.query.offset) || null,
  });
  res.status(StatusCodes.OK).json({ ads });
};

const getAd = async (req, res) => {
  const { _id } = req.body;
  const ad = await Ad.findByPk(_id);
  if (!ad) {
    throw new NotFoundError('cant find any ads by this information');
  }
  res.status(StatusCodes.OK).json({ ad });
};

const createAd = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError('No File Uploaded');
  }
  const productImage = req.files.image;
  if (!productImage.mimetype.startsWith('image')) {
    throw new BadRequestError('Please Upload Image');
  }
  const maxSize = 512 * 512;
  if (productImage.size > maxSize) {
    throw new BadRequestError('Please upload image smaller 0.5MB');
  }
  const imagePath = path.join(
    __dirname,
    '../../public/ads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  const ad = await Ad.create({
    owner: req.user,
    src: `/ads/${productImage.name}`,
    plan: parseInt(req.query.plan),
    expireAt: Date.now() + 259200000,
  });
  res
    .status(StatusCodes.OK)
    .json({ image: { src: `/ads/${productImage.name}` } });
};

module.exports = {
  getAllAds,
  getAd,
  createAd,
};
