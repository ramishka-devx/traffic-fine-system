const ROLES = Object.freeze({
  OFFICER: 'OFFICER',               //Regular traffic police officer. Can issue fines and verify payment status
  SENIOR_OFFICER: 'SENIOR_OFFICER', //Senior traffic police officer. Same as OFFICER plus elevated privileges.
  ADMIN: 'ADMIN',                   //Senior Official. Full access: manage officers,
  DRIVER: 'DRIVER',                 //Public driver. Can register, login and view own fines.
});

module.exports = ROLES;
