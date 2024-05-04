const express = require('express');
const router = express.Router();
const {
  getAllAds,
  createAd,
  getAd,
  payment,
} = require('../controllers/adsController');
const { authenticateUser } = require('../middleware/authentication');

router.route('/api/ads').get(getAllAds).post(authenticateUser, createAd);

router.use('/api/ad/payments', payment);

router.route('/api/ad/:id').get(getAd);
module.exports = router;
