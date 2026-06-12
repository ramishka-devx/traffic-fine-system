const driverService = require('./driver.service');
const asyncHandler = require('../../common/utils/asyncHandler');

// Public endpoint — any user can attempt to register.
// The service will reject them if their license has no issued fine.
exports.register = asyncHandler(async (req, res) => {
  const { driver_license_number, mobile_number, password } = req.body;

  const newDriver = await driverService.register({
    driver_license_number,
    mobile_number,
    password
  });

  res.status(201).json({
    success: true,
    message: 'Account created successfully. You can now log in.',
    data: {
      id: newDriver.id,
      driver_license_number: newDriver.driver_license_number
    }
  });
});

// issues JWT tokens on successful authentication.
exports.login = asyncHandler(async (req, res) => {
  const { driver_license_number, password } = req.body;

  const tokens = await driverService.login(driver_license_number, password);

  res.status(200).json({
    success: true,
    data: tokens
  });
});

// Protected — requires a valid DRIVER JWT.
// Returns all fines associated with the logged-in driver's license number.
exports.getMyFines = asyncHandler(async (req, res) => {
  // req.user.id is the driver's primary key, set by the authenticate middleware
  const fines = await driverService.getMyFines(req.user.id);

  res.status(200).json({
    success: true,
    data: fines
  });
});
