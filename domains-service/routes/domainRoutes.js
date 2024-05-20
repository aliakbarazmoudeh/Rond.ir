const express = require("express");
const router = express.Router();
const {
  addDomain,
  deleteDomain,
  getAllDomains,
  getAllUserDomains,
  getSingleDomain,
  updateDomain,
  payment,
} = require("../controllers/domainController");
const { authenticateUser } = require("../middleware/authentication");

router
  .route("/api/domain")
  .get(getAllDomains)
  .post(authenticateUser, addDomain);

router
  .route("/api/domain/:id")
  .get(getSingleDomain)
  .patch(authenticateUser, updateDomain)
  .delete(authenticateUser, deleteDomain);

router.route("/api/userDomains").get(getAllUserDomains);

router.use("/api/domain/payments", payment);

module.exports = router;
