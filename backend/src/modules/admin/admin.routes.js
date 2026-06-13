const express = require('express');
const router = express.Router();
const adminController = require('./admin.controller');

const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const ROLES = require('../../common/constants/roles');

// Apply authentication and admin authorization to ALL routes in this file
router.use(authenticate);
router.use(authorize(ROLES.ADMIN));

// GET /api/admin/dashboard - Retrieve system-wide statistics
router.get('/dashboard', adminController.getDashboard);

module.exports = router;
