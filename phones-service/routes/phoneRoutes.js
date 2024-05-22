const express = require("express");
const router = express.Router();
const {
  addPhone,
  deletePhone,
  getAllPhones,
  getAllUserPhones,
  getSinglePhone,
  updatePhone,
  payment,
} = require("../controllers/phoneController");
const { authenticateUser } = require("../middleware/authentication");

router.route("/api/phone").get(getAllPhones).post(authenticateUser, addPhone);
router
  .route("/api/userPhones/:phoneNumber")
  .get(authenticateUser, getAllUserPhones);

router.use("/api/phone/payments", payment);

router
  .route("/api/phone/:id")
  .get(getSinglePhone)
  .patch(authenticateUser, updatePhone)
  .delete(authenticateUser, deletePhone);

module.exports = router;
