const fineService = require('./fine.service');
const asyncHandler = require('../../common/utils/asyncHandler');

exports.issueFine = asyncHandler(async (req, res) => {
  const fine = await fineService.createFine(req.user.id, req.body);
  res.status(201).json(fine);
});

exports.lookupFine = asyncHandler(async (req, res) => {
  const { referenceNumber } = req.params;
  const { categoryCode } = req.query;
  const fine = await fineService.getFineByReference(referenceNumber, categoryCode);
  res.status(200).json(fine);
});

exports.verifyStatus = asyncHandler(async (req, res) => {
  const { referenceNumber, vehicleNumber } = req.query;
  const result = await fineService.verifyStatus({ referenceNumber, vehicleNumber });
  
  res.status(200).json({
    success: true,
    data: result
  });
});