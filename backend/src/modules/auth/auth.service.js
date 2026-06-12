const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../../config/env');
const authRepository = require('./auth.repository');
const { UnauthorizedError } = require('../../common/errors/ConcreteErrors');

/**
 * Generate a JWT Access Token
 */
const generateAccessToken = (officerId, role, stationCode) => {
  return jwt.sign(
    { sub: officerId, role, stationCode },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
};

const generateAndStoreRefreshToken = async (officerId) => {
  // 1. Generate a random 64-byte hex string
  const refreshToken = crypto.randomBytes(64).toString('hex');
  
  // 2. Hash it for database storage
  const tokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
  
  // 3. Calculate expiration 7days
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); 
  
  // 4. Save to DB
  await authRepository.saveRefreshToken(officerId, tokenHash, expiresAt);
  
  return refreshToken;
};

exports.authenticateOfficer = async (badgeNumber, password) => {
  // Find officer using Repository
  const officer = await authRepository.findOfficerByBadge(badgeNumber);
  if (!officer) throw new UnauthorizedError('Invalid credentials provided');

  // Verify password
  const isMatch = await bcrypt.compare(password, officer.password_hash);
  if (!isMatch) throw new UnauthorizedError('Invalid credentials provided');

  // Generate both tokens
  const accessToken = generateAccessToken(officer.id, officer.role, officer.station_code);
  const refreshToken = await generateAndStoreRefreshToken(officer.id);

  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'Bearer',
    expires_in: 3600, // 1 hour
    user: { id: officer.id, name: officer.full_name, role: officer.role }
  };
};

exports.refreshSession = async (incomingRefreshToken) => {
  // 1. Hash the incoming token
  const tokenHash = crypto.createHash('sha256').update(incomingRefreshToken).digest('hex');
  
  // 2. Look it up in the database
  const storedToken = await authRepository.findRefreshToken(tokenHash);
  
  if (!storedToken) {
    throw new UnauthorizedError('Invalid refresh token');
  }
  if (storedToken.revoked) {
    throw new UnauthorizedError('Refresh token has been revoked. Please log in again.');
  }
  if (new Date() > new Date(storedToken.expires_at)) {
    throw new UnauthorizedError('Refresh token has expired. Please log in again.');
  }
  
  // 3. Token is valid. Issue a new access token.
  const newAccessToken = generateAccessToken(
    storedToken.officer_id, 
    storedToken.role, 
    storedToken.station_code
  );
  
  return {
    access_token: newAccessToken,
    token_type: 'Bearer',
    expires_in: 3600
  };
};

exports.logout = async (incomingRefreshToken) => {
  const tokenHash = crypto.createHash('sha256').update(incomingRefreshToken).digest('hex');
  await authRepository.revokeRefreshToken(tokenHash);
  // We don't throw an error if it's already revoked or not found; 
  // logout should be idempotent and always succeed.
};