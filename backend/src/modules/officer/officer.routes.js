const express = require('express');
const router = express.Router();
const officerController = require('./officer.controller');
const {
  createOfficerValidator,
  updateOfficerValidator,
  officerIdValidator
} = require('./officer.validator');

const validate = require('../../middleware/validate');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const ROLES = require('../../common/constants/roles');

// GET all officers:
//   - ADMIN sees ALL officers across all stations
//   - SENIOR_OFFICER sees ONLY officers in their own station
router.get(
  '/',
  authenticate,
  authorize(ROLES.SENIOR_OFFICER, ROLES.ADMIN),
  officerController.getAllOfficers
);

// GET a single officer by ID:
//   - Both ADMIN and SENIOR_OFFICER can look up an individual officer
router.get(
  '/:id',
  authenticate,
  authorize(ROLES.SENIOR_OFFICER, ROLES.ADMIN),
  officerIdValidator,
  validate,
  officerController.getOfficerById
);

// POST create a new officer:
//   - ADMIN can create any role at any station
//   - SENIOR_OFFICER can create OFFICER role only, always at their own station
router.post(
  '/',
  authenticate,
  authorize(ROLES.SENIOR_OFFICER, ROLES.ADMIN),
  createOfficerValidator,
  validate,
  officerController.createOfficer
);

// PATCH update an officer — ADMIN only.
//   SENIOR_OFFICER cannot update to prevent role promotion attacks.
router.patch(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  updateOfficerValidator,
  validate,
  officerController.updateOfficer
);

// DELETE (soft-delete/deactivate) — ADMIN only.
router.delete(
  '/:id',
  authenticate,
  authorize(ROLES.ADMIN),
  officerIdValidator,
  validate,
  officerController.deactivateOfficer
);

module.exports = router;
