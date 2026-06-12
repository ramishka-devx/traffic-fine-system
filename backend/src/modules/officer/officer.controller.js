const officerService = require('./officer.service');
const asyncHandler = require('../../common/utils/asyncHandler');

// Get all officers.
// req.user is passed so the service can scope results by station for SENIOR_OFFICER.
exports.getAllOfficers = asyncHandler(async (req, res) => {
  const onlyActive = req.query.active === 'true';
  const officers = await officerService.getAllOfficers(req.user, onlyActive);
  
  res.status(200).json({
    success: true,
    data: officers
  });
});

// Get a single officer by ID
exports.getOfficerById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const officer = await officerService.getOfficerById(Number(id));
  
  res.status(200).json({
    success: true,
    data: officer
  });
});

// Create a new officer.
// The full req.user object is passed so the service can enforce:
//   - SENIOR_OFFICER can only create OFFICER role
//   - SENIOR_OFFICER's station is always forced from JWT (cannot be tampered)
exports.createOfficer = asyncHandler(async (req, res) => {
  const { badge_number, full_name, phone_number, password, role, station_code } = req.body;
  
  const newOfficer = await officerService.createOfficer(req.user, {
    badge_number,
    full_name,
    phone_number,
    password,
    role,
    station_code
  });
  
  res.status(201).json({
    success: true,
    message: 'Officer created successfully',
    data: newOfficer
  });
});

// Update an officer — ADMIN only route
exports.updateOfficer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { full_name, phone_number, role, station_code, is_active } = req.body;
  const adminId = req.user.id;
  
  const updatedOfficer = await officerService.updateOfficer(adminId, Number(id), {
    full_name,
    phone_number,
    role,
    station_code,
    is_active
  });
  
  res.status(200).json({
    success: true,
    message: 'Officer updated successfully',
    data: updatedOfficer
  });
});

// Deactivate an officer (soft-delete) — ADMIN only route
exports.deactivateOfficer = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminId = req.user.id;
  
  await officerService.deactivateOfficer(adminId, Number(id));
  
  res.status(200).json({
    success: true,
    message: 'Officer deactivated successfully'
  });
});
