const express = require('express');
const {
  registerNormalUser,
  login,
  logOut,
  currenUser,
  updateUser,
  deleteUser,
  getSingleUser,
  legalUserRegister,
} = require('../controllers/userController');
const { authenticateUser } = require('../middleware/authentication');
const router = express.Router();

router
  .route('/api/user')
  .get(authenticateUser, currenUser)
  .patch(authenticateUser, updateUser)
  .delete(authenticateUser, deleteUser);
router.route('/api/registerNormalUser').post(registerNormalUser);
router.route('/api/registerLegalUser').post(legalUserRegister);
router.route('/api/login').post(login);
router.route('/api/logout').post(authenticateUser, logOut);
router.route('/api/user/:id').get(getSingleUser);

module.exports = router;
