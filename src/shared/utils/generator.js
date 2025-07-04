const crypto = require('crypto');

const generateAccountNumber = () => {
  const prefix = 'YSB-';
  const timestamp = Date.now().toString().slice(-8); 
  const randomDigits = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}${timestamp}${randomDigits}`;
}

const generateTransactionId = (prefix = 'DEP') => {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `${prefix}-${datePart}-${randomPart}`;
}

module.exports = {
  generateAccountNumber,
  generateTransactionId
};