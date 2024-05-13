const express = require("express");
const router = express.Router();
const {
  getAllAds,
  createAd,
  getAd,
  payment,
  getAllAdsForAdmins,
  getSingleAdForAdmin,
  adSubmission,
  adDisagreed,
} = require("../controllers/adsController");
const { authenticateUser } = require("../middleware/authentication");
const { authorizePermissions } = require("../middleware/authentication");

router.use(authenticateUser);

router.route("/api/ads").get(getAllAds).post(createAd);

// admin panel
router
  .route("/api/ads-submission")
  .get(authorizePermissions("admin"), getAllAdsForAdmins);
router
  .route("/api/ads-submission/:id")
  .get(authorizePermissions("admin"), getSingleAdForAdmin)
  .patch(authorizePermissions("admin"), adSubmission)
  .delete(authorizePermissions("admin"), adDisagreed);

router.use("/api/ad/payments", payment);

router.route("/api/ad/:id").get(getAd);
module.exports = router;
