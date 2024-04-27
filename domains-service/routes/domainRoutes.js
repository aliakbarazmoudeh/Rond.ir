const express = require('express');
const router = express.Router();
const {
  addDomain,
  deleteDomain,
  getAllDomainsFromUnkUser,
  getAllDomains,
  getAllUserDomains,
  getSingleDomain,
  updateDomain,
} = require('../controllers/domainController');
const { authenticateUser } = require('../middleware/authentication');

router
  .route('/api/domain')
  .get(getAllDomains)
  .post(authenticateUser, addDomain)
  .patch(authenticateUser, updateDomain)
  .delete(authenticateUser, deleteDomain);
router.route('/api/userDomains').get(authenticateUser, getAllUserDomains);
router.route('/api/unkUserDomains').post(getAllDomainsFromUnkUser);

router.route('/api/domain/:domain').get(getSingleDomain);

module.exports = router;
