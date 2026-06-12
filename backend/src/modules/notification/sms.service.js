const notificationRepository = require('./notification.repository');
const smsAdapter = require('./sms.adapter');

exports.dispatchPaymentConfirmationMessage = async (fineId) => {
  const data = await notificationRepository.getFineDetailsForNotification(fineId);
  if (!data) return;

  const messageBody = `Fine ${data.reference_number} for vehicle ${data.vehicle_number} has been paid. Amount: LKR ${data.base_amount}. Driver may collect license. - SLPD`;

  try {
    await smsAdapter.sendSmsViaNotifyLk(data.officer_phone, messageBody);
    await notificationRepository.createSmsNotificationLog(fineId, data.officer_phone, messageBody, 'SENT');
  } catch (err) {
    console.error(`Failed to send payment confirmation SMS for fine ID ${fineId}:`, err.message);
    await notificationRepository.createSmsNotificationLog(fineId, data.officer_phone, messageBody, 'FAILED');
  }
};