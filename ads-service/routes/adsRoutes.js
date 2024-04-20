const express = require('express');
const router = express.Router();
const {
  getAllAds,
  createAd,
  getAd,
} = require('../controllers/adsController');
const { authenticateUser } = require('../middleware/authentication');

router
  .route('/api/ads')
  .get(getAllAds)
  .post(authenticateUser, createAd)

router.route('/api/ad/:id').get(getAd);
module.exports = router;
