const FINE_STATUS = Object.freeze({
  UNPAID: 'UNPAID',     //Default state when a fine is first issued. Payment is still due
  PAID: 'PAID',         //Set atomically after a successful PayHere payment webhook is processed.
  CANCELLED: 'CANCELLED', //Reserved for admin-level cancellation of an erroneously issued fine.
});

module.exports = FINE_STATUS;
