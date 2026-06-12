const authService = require('./auth.service');
const asyncHandler = require('../../common/utils/asyncHandler');

exports.login = asyncHandler(async (req, res) => {
  const { badge_number, password } = req.body;
  const sessionPayload = await authService.authenticateOfficer(badge_number, password);
  res.status(200).json({
    success: true,
    data: sessionPayload
  });
});

exports.refresh = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;
  const sessionPayload = await authService.refreshSession(refresh_token);
  res.status(200).json({
    success: true,
    data: sessionPayload
  });
});

exports.logout = asyncHandler(async (req, res) => {
  const { refresh_token } = req.body;
  await authService.logout(refresh_token);
  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});