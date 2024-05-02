const express = require('express');
const router = express.Router();
const {
  addSaveMessage,
  deleteSaveMessage,
  getAllUserSaveMessage,
  getSingleSaveMessage,
} = require('../controllers/saveController');
const { authenticateUser } = require('../middleware/authentication');

router.use(authenticateUser);
router
  .route('/api/save')
  .get(getAllUserSaveMessage)
  .post(addSaveMessage)
  .delete(deleteSaveMessage);

module.exports = router;
