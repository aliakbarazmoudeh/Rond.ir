const express = require("express");
const router = express.Router();
const {
  addViewedPost,
  getAllViewedPostsByUser,
} = require("../controllers/viewedController");
const { authenticateUser } = require("../middleware/authentication");

router.use(authenticateUser);
router.route("/api/viewed").get(getAllViewedPostsByUser).post(addViewedPost);

module.exports = router;
