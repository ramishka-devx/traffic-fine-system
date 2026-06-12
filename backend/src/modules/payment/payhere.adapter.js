const crypto = require('crypto');
const env = require('../../config/env');

exports.verifySignature = (params) => {
  const { merchant_id, order_id, payhere_amount, payhere_currency, status_code, md5sig } = params;
  
  // Implements the MD5 checksum verification sequence mandated by PayHere checkout specifications
  const secretHash = crypto.createHash('md5').update(env.PAYHERE_SECRET).digest('hex').toUpperCase();
  const derivedString = merchant_id + order_id + payhere_amount + payhere_currency + status_code + secretHash;
  const calculatedSignature = crypto.createHash('md5').update(derivedString).digest('hex').toUpperCase();

  return calculatedSignature === (md5sig ? md5sig.toUpperCase() : '');
};