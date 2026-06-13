const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../../config/db');
const env = require('../../config/env');
const driverRepository = require('./driver.repository');
const fineRepository = require('../fine/fine.repository');
const {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ForbiddenError
} = require('../../common/errors/ConcreteErrors');
const ROLES = require('../../common/constants/roles');

// Generate a short-lived JWT access token for a driver.
// Driver JWTs have no stationCode — drivers don't belong to stations.
const generateDriverAccessToken = (driverId) => {
  return jwt.sign(
    { sub: driverId, role: ROLES.DRIVER },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

// Generate a random refresh token, hash it, and store in driver_refresh_tokens.
const generateAndStoreRefreshToken = async (driverId) => {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 day expiry

  await driverRepository.saveRefreshToken(driverId, tokenHash, expiresAt);
  return refreshToken;
};

// Register a new driver account.
// GUARD: The driver_license_number must already have at least one fine in the system.
// This proves they are a real person who has been issued a fine — not a random signup.
exports.register = async (driverData) => {
  const { driver_license_number, mobile_number, password } = driverData;

  // 1. Registration guard: license must have an existing fine
  const hasFine = await driverRepository.hasFine(driver_license_number);
  if (!hasFine) {
    throw new ForbiddenError(
      'Registration is only available to drivers who have been issued a fine'
    );
  }

  // 2. Duplicate check: license number must not already have an account
  const existing = await driverRepository.findByLicense(driver_license_number);
  if (existing) {
    throw new ConflictError('An account with this license number already exists');
  }

  // 3. Hash the password
  const salt = await bcrypt.genSalt(10);
  const password_hash = await bcrypt.hash(password, salt);

  // 4. Insert the new driver
  const newDriver = await driverRepository.insert({
    driver_license_number,
    mobile_number,
    password_hash
  });

  return newDriver;
};

// Login a driver and issue tokens.
exports.login = async (licenseNumber, password) => {
  // 1. Find driver by license number
  const driver = await driverRepository.findByLicense(licenseNumber);
  if (!driver) throw new UnauthorizedError('Invalid credentials provided');

  // 2. Check account is active
  if (!driver.is_active) throw new UnauthorizedError('Account is deactivated');

  // 3. Verify password
  const isMatch = await bcrypt.compare(password, driver.password_hash);
  if (!isMatch) throw new UnauthorizedError('Invalid credentials provided');

  // 4. Issue tokens
  const accessToken = generateDriverAccessToken(driver.id);
  const refreshToken = await generateAndStoreRefreshToken(driver.id);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'Bearer',
    expires_in: 3600,
    user: {
      id: driver.id,
      driver_license_number: driver.driver_license_number,
      role: ROLES.DRIVER
    }
  };
};

// Retrieve all fines for the currently logged-in driver.
// The license number is looked up from the DB using the driver ID from their JWT.
// This prevents a driver from querying fines for another license number by manipulating request input.
exports.getMyFines = async (driverId) => {
  // Fetch driver record by primary key to get their trusted license number
  const { rows } = await db.query(
    'SELECT driver_license_number FROM drivers WHERE id = $1',
    [driverId]
  );

  if (!rows[0]) throw new NotFoundError('Driver account not found');

  const licenseNumber = rows[0].driver_license_number;

  // Delegate to fine repository to fetch all fines by license
  return await fineRepository.findByLicense(licenseNumber);
};
