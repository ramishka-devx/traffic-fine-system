const qrcode = require('qrcode');
const refGen = require('../../common/utils/referenceGenerator');
const { NotFoundError } = require('../../common/errors/ConcreteErrors');
const fineRepository = require('./fine.repository');
const auditLogger = require('../../common/utils/auditLogger');

exports.createFine = async (officerId, fineData) => {
  const { vehicleNumber, driverLicenseNumber, categoryId, notes } = fineData;

  const category = await fineRepository.findActiveCategoryById(categoryId);
  if (!category) throw new NotFoundError('Fine category not found or is inactive');

  const referenceNumber = await refGen.generateFineReferenceNumber();

  // Due date is 30 days from the issue date per the fine payment policy
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  const fine = await fineRepository.insertFine(
    referenceNumber, categoryId, officerId, vehicleNumber, driverLicenseNumber, dueDate, notes
  );

  // Generate a QR code that encodes the public payment info URL.
  // When a driver scans this QR, they can view their fine and choose to pay.
  // No login is needed to scan.
  const paymentUrl = `/api/payments/fine/${referenceNumber}`;
  const qrCode = await qrcode.toDataURL(paymentUrl);

  // LOG THE ACTION
  await auditLogger.logAction(officerId, 'CREATE', 'FINE', fine.id, {
    referenceNumber,
    vehicleNumber,
    amount: category.base_amount
  });

  // Return fine data along with the QR code as a base64 data URI.
  // Frontend can embed this directly: <img src={qrCode} />
  return { ...fine, qrCode };
};

exports.getFineByReference = async (frn, fci) => {
  const fine = await fineRepository.findByReferenceAndCategory(frn, fci);
  if (!fine) throw new NotFoundError('Fine not found for the provided reference number and category code');
  return fine;
};

exports.verifyStatus = async (searchParams) => {
  const { referenceNumber, vehicleNumber } = searchParams;

  if (referenceNumber) {
    const fine = await fineRepository.findByReferenceNumber(referenceNumber);
    if (!fine) throw new NotFoundError(`No fine found with reference number ${referenceNumber}`);
    return [fine];
  }

  if (vehicleNumber) {
    const fines = await fineRepository.findByVehicleNumber(vehicleNumber);
    if (fines.length === 0) throw new NotFoundError(`No fines found for vehicle ${vehicleNumber}`);
    return fines;
  }

  throw new Error('Either referenceNumber or vehicleNumber must be provided');
};