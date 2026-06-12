const bcrypt = require('bcryptjs');
const officerRepository = require('./officer.repository');
const auditLogger = require('../../common/utils/auditLogger');
const { ConflictError, NotFoundError, ForbiddenError } = require('../../common/errors/ConcreteErrors');
const ROLES = require('../../common/constants/roles');

// Get all officers.
// If the caller is a SENIOR_OFFICER, results are scoped to their station only.
// If the caller is ADMIN, all officers are returned.
exports.getAllOfficers = async (creator, onlyActive = false) => {
  if (creator.role === ROLES.SENIOR_OFFICER) {
    return await officerRepository.findByStation(creator.stationCode, onlyActive);
  }
  return await officerRepository.findAll(onlyActive);
};

// Get a single officer by ID
exports.getOfficerById = async (id) => {
  const officer = await officerRepository.findById(id);
  if (!officer) {
    throw new NotFoundError(`Officer with ID ${id} not found`);
  }
  return officer;
};

// Create a new officer.
// creator = req.user (contains id, role, stationCode from JWT)
exports.createOfficer = async (creator, officerData) => {
  // GUARD 1: SENIOR_OFFICER can only create regular OFFICERs.
  // If they try to set role to SENIOR_OFFICER or ADMIN, reject immediately.
  if (
    creator.role === ROLES.SENIOR_OFFICER &&
    officerData.role &&
    officerData.role !== ROLES.OFFICER
  ) {
    throw new ForbiddenError('Senior officers can only create regular officer accounts');
  }

  // GUARD 2: SENIOR_OFFICER's station is always taken from their JWT token.
  // We completely ignore any station_code provided in the request body.
  // This prevents a malicious SENIOR_OFFICER from assigning officers to other stations.
  const station_code =
    creator.role === ROLES.SENIOR_OFFICER
      ? creator.stationCode          // forced from JWT — tamper-proof
      : officerData.station_code;    // ADMIN can assign any station

  // 1. Check if badge number is already taken
  const existing = await officerRepository.findByBadgeNumber(officerData.badge_number);
  if (existing) {
    throw new ConflictError(`Badge number '${officerData.badge_number}' is already registered`);
  }

  // 2. Hash the password securely
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(officerData.password, salt);

  // 3. Prepare data for insertion
  const newOfficerData = {
    ...officerData,
    station_code,
    password_hash: hashedPassword
  };

  // 4. Save to database
  const createdOfficer = await officerRepository.insert(newOfficerData);

  // Log the action
  await auditLogger.logAction(creator.id, 'CREATE', 'OFFICER', createdOfficer.id, {
    badge_number: createdOfficer.badge_number,
    role: createdOfficer.role
  });

  return createdOfficer;
};

// Update an officer's details — ADMIN only (route is already guarded)
exports.updateOfficer = async (adminId, id, officerData) => {
  const existing = await officerRepository.findById(id);
  if (!existing) {
    throw new NotFoundError(`Officer with ID ${id} not found`);
  }

  const updatedData = {
    full_name:    officerData.full_name    !== undefined ? officerData.full_name    : existing.full_name,
    phone_number: officerData.phone_number !== undefined ? officerData.phone_number : existing.phone_number,
    role:         officerData.role         !== undefined ? officerData.role         : existing.role,
    station_code: officerData.station_code !== undefined ? officerData.station_code : existing.station_code,
    is_active:    officerData.is_active    !== undefined ? officerData.is_active    : existing.is_active,
  };

  const updated = await officerRepository.update(id, updatedData);

  // Log the action
  await auditLogger.logAction(adminId, 'UPDATE', 'OFFICER', id, {
    changed_fields: Object.keys(officerData)
  });

  return updated;
};

// Deactivate an officer (soft delete) — ADMIN only (route is already guarded)
exports.deactivateOfficer = async (adminId, id) => {
  const existing = await officerRepository.findById(id);
  if (!existing) {
    throw new NotFoundError(`Officer with ID ${id} not found`);
  }
  
  const deactivated = await officerRepository.deactivate(id);

  // Log the action
  await auditLogger.logAction(adminId, 'DEACTIVATE', 'OFFICER', id, {
    badge_number: existing.badge_number
  });

  return deactivated;
};
