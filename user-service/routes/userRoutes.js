const express = require("express");
const {
  createUser,
  createAdmin,
  login,
  logOut,
  currenUser,
  updateUser,
  deleteUser,
  getSingleUser,
} = require("../controllers/userController");
const { authenticateUser } = require("../middleware/authentication");
const router = express.Router();

router
  .route("/api/user")
  .get(authenticateUser, currenUser)
  .post(createUser)
  .patch(authenticateUser, updateUser)
  .delete(authenticateUser, deleteUser);
router.route("/api/login").post(login);
router.route("/api/logout").post(authenticateUser, logOut);
router.route("/api/user/:id").get(getSingleUser);
router.route("/api/auth/admin").post(createAdmin);

module.exports = router;
