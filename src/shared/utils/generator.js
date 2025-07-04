const generateAccountNumber = () => {
  const prefix = 'YSB-';
  const timestamp = Date.now().toString().slice(-8); 
  const randomDigits = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix}${timestamp}${randomDigits}`;
}

module.exports = {
    generateAccountNumber
};