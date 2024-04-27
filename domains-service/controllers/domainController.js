const { StatusCodes } = require('http-status-codes');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');
const { Op } = require('sequelize');
const Domain = require('../models/Domain');
const User = require('../models/User');

const addDomain = async (req, res) => {
  const owner = req.user;
  const {
    domain,
    domainInFarsi,
    price,
    category,
    termOfSale,
    phone,
    description,
  } = req.body;
  const isExist = await Domain.findByPk(domain);
  if (isExist) {
    throw new BadRequestError('domain already created');
  }

  if (price < 10000 && price >= 3) {
    throw new BadRequestError('pleas provide a valid price');
  }

  const userDomain = await Domain.create({
    domain,
    domainInFarsi,
    price,
    category,
    termOfSale,
    phone,
    description,
    owner,
  });

  const user = await User.findByPk(owner);
  if (user.dataValues.productCount === 0) {
    throw new BadRequestError('User cant add sim card, has to buy premium');
  }
  user.set({ productCount: user.dataValues.productCount - 1 });
  await user.save();

  res.status(StatusCodes.CREATED).json({
    userDomain,
    status: StatusCodes.CREATED,
    msg: owner,
  });
};

const getAllDomains = async (req, res) => {
  let where = {};
  req.query.name ? (where.domain = { [Op.like]: `%${req.query.name}%` }) : null;
  req.query.domain
    ? (where.domain = { [Op.endsWith]: `%${req.query.domain}%` })
    : null;
  req.query.domainInFarsi
    ? (where.domainInFarsi = { [Op.like]: `%${req.query.domainInFarsi}%` })
    : null;
  req.query.category ? (where.category = req.query.category.split(',')) : null;
  req.query.gte
    ? (where.price = {
        [Op.gte]: req.query.gte,
        [Op.lt]: req.query.lt || 1000000000000,
      })
    : null;
  req.query.lt
    ? (where.price = { [Op.lt]: req.query.lt, [Op.gte]: req.query.gte || 0 })
    : null;
  const domains = await Domain.findAndCountAll({
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
    limit: parseInt(req.query.limit) || 10,
    offset: parseInt(req.query.offset) || 0,
  });
  res.status(StatusCodes.OK).json({ domains });
};

const getSingleDomain = async (req, res) => {
  const domain = await Domain.findByPk(req.params.domain, {
    include: [{ model: User }],
  });
  if (!domain) {
    throw new NotFoundError('cant find any domain with this informations');
  }
  res
    .status(StatusCodes.OK)
    .json({ status: StatusCodes.OK, msg: 'find successfully', domain });
};

const getAllDomainsFromUnkUser = async (req, res) => {
  const user = await User.findByPk(req.body.owner, {
    include: [{ model: Domain }],
  });
  if (!user) {
    throw new NotFoundError('cant find any data with this informations');
  }
  res.status(StatusCodes.OK).json({
    user,
    status: StatusCodes.OK,
    msg: 'proccess completed successfuly',
  });
};

const getAllUserDomains = async (req, res) => {
  const user = await User.findByPk(req.user, { include: [{ model: Domain }] });
  if (!user) {
    throw new NotFoundError('cant find any data with this informations');
  }
  res.status(StatusCodes.OK).json({ user });
};

const updateDomain = async (req, res) => {
  const owner = req.user;
  const { price } = req.body;

  if (price < 10000 && price >= 3) {
    throw new BadRequestError('pleas provide a valid price');
  }

  const userDomain = await Domain.findByPk(req.body.oldDomain);
  if (!userDomain) {
    throw new NotFoundError('cant find any domains');
  }
  if (userDomain.dataValues.owner != owner) {
    throw new UnauthorizedError('invalid credentials');
  }
  userDomain.set(req.body);
  await userDomain.save({
    fields: [
      'domain',
      'domainInFarsi',
      'termOfSale',
      'price',
      'category',
      'phone',
      'description',
    ],
  });
  res
    .status(StatusCodes.OK)
    .json({ status: StatusCodes.OK, msg: 'domain updated successfully' });
};

const deleteDomain = async (req, res) => {
  const owner = req.user;
  const userDomain = await Domain.findByPk(req.body.domain);
  if (!userDomain) {
    throw new NotFoundError('cant find any domain with this credentials');
  }
  if (userDomain.dataValues.owner != owner) {
    throw new UnauthorizedError('invalid credentials');
  }
  await userDomain.destroy();
  res
    .status(StatusCodes.OK)
    .json({ status: StatusCodes.OK, msg: 'domain destroyed successfully' });
};

module.exports = {
  addDomain,
  deleteDomain,
  getAllDomainsFromUnkUser,
  getAllDomains,
  getAllUserDomains,
  getSingleDomain,
  updateDomain,
};
