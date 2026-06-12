const env = require('../../config/env');

exports.sendSmsViaNotifyLk = async (toPhoneNumber, textPayload) => {
  if (!env.NOTIFY_LK_API_KEY) {
    console.warn('SMS dispatch skipped: Missing provider integration key');
    return { mockDispatched: true };
  }

  const endpoint = `https://app.notify.lk/api/v1/send?api_key=${env.NOTIFY_LK_API_KEY}&to=${toPhoneNumber}&message=${encodeURIComponent(textPayload)}`;
  
  const response = await fetch(endpoint, { method: 'POST' });
  if (!response.ok) {
    throw new Error(`Notify.lk API request failed with status: ${response.status}`);
  }
  return await response.json();
};