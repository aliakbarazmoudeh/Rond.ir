const express = require('express');
const router = express.Router();
const {
  addPhone,
  deletePhone,
  getAllPhones,
  getAllPhonesFromUnkUser,
  getAllUserPhones,
  getSinglePhone,
  updatePhone,
  payment,
} = require('../controllers/phoneController');
const { authenticateUser } = require('../middleware/authentication');

router
  .route('/api/phone')
  .get(getAllPhones)
  .post(authenticateUser, addPhone)
  .patch(authenticateUser, updatePhone)
  .delete(authenticateUser, deletePhone);
router.route('/api/userPhones').get(authenticateUser, getAllUserPhones);
router.route('/api/unkUserPhones').post(getAllPhonesFromUnkUser);

router.use('/api/phone/payments', payment);

router.route('/api/phone/:id').get(getSinglePhone);

module.exports = router;
