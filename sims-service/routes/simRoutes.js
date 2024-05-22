const express = require("express");
const router = express.Router();
const {
  addSim,
  getAllSims,
  updateSim,
  deleteSim,
  getSingleSim,
  getAllUserSims,
  payment,
} = require("../controllers/simController");
const { authenticateUser } = require("../middleware/authentication");

router.route("/api/sim").get(getAllSims).post(authenticateUser, addSim);

router.route("/api/userSims").get(authenticateUser, getAllUserSims);

router
  .route("/api/sim/:id")
  .get(getSingleSim)
  .patch(authenticateUser, updateSim)
  .delete(authenticateUser, deleteSim);

router.use("/api/sim/payments", payment);

module.exports = router;
