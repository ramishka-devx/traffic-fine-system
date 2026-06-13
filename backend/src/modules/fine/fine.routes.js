const express = require('express');
const router = express.Router();
const fineController = require('./fine.controller');
const { issueFineValidator, lookupFineValidator, verifyStatusValidator } = require('./fine.validator');
const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const ROLES = require('../../common/constants/roles');

// SENIOR_OFFICER & ADMIN only: search fines by vehicle number or reference number.
router.get(
  '/status/verify',
  authenticate,
  authorize(ROLES.SENIOR_OFFICER, ROLES.ADMIN),
  verifyStatusValidator,
  validate,
  fineController.verifyStatus
);

// Officers issue a new fine (all officer roles can issue fines)
router.post(
  '/',
  authenticate,
  authorize(ROLES.OFFICER, ROLES.SENIOR_OFFICER, ROLES.ADMIN),
  issueFineValidator,
  validate,
  fineController.issueFine
);

// SENIOR_OFFICER & ADMIN only: look up a fine by reference number + category code (FRN+FCI).
// Drivers use the public payment endpoint instead (GET /api/payments/fine/:referenceNumber).
router.get(
  '/:referenceNumber',
  authenticate,
  authorize(ROLES.SENIOR_OFFICER, ROLES.ADMIN),
  lookupFineValidator,
  validate,
  fineController.lookupFine
);

module.exports = router;