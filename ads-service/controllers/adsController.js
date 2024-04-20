// const User = require('../models/User');

const getAllAds = async (req, res) => {
  res.send('getting all ads');
};

const getAd = async (req, res) => {
  res.send('getting ad');
};

const createAd = async (req, res) => {
  res.send('creating ad');
};

const UpdateAd = async (req, res) => {
  res.send('creating ad');
};

const deleteAd = async (req, res) => {
  res.send('creating ad');
};

const getAllUserAds = () => {
  res.send("getting all user's ads");
};

module.exports = {
  getAllAds,
  getAd,
  createAd,
  UpdateAd,
  deleteAd,
  getAllUserAds,
};
