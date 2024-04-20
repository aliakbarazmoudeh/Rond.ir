const express = require('express');
const router = express.Router();
const {
  getAllAds,
  createAd,
  UpdateAd,
  deleteAd,
  getAd,
  getAllUserAds,
} = require('../controllers/adsController');
const { authenticateUser } = require('../middleware/authentication');

router
  .route('/api/ads')
  .get(getAllAds)
  .post(authenticateUser, createAd)
  .patch(authenticateUser, UpdateAd)
  .delete(authenticateUser, deleteAd);

router.route('/api/ad/:id').get(getAd);
router.route('/api/userAds').get(authenticateUser, getAllUserAds);
module.exports = router;
