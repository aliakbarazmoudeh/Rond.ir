const express = require('express');
const router = express.Router();
const {
  addSim,
  getAllSims,
  updateSim,
  deleteSim,
  getSingleSim,
  getAllSimsFromUnkUser,
  getAllUserSims,
} = require('../controllers/simController');
const { authenticateUser } = require('../middleware/authentication');

router
  .route('/api/sim')
  .get(getAllSims)
  .post(authenticateUser, addSim)
  .patch(authenticateUser, updateSim)
  .delete(authenticateUser, deleteSim);
router.route('/api/userSims').get(authenticateUser, getAllUserSims);
router.route('/api/unkUserSims').post(getAllSimsFromUnkUser);

router.route('/api/sim/:phoneNumber').get(getSingleSim);

module.exports = router;
