const ZarinpalCheckout = require('zarinpal-checkout');
const { BadRequestError } = require('../../errors');
const zarinpal = ZarinpalCheckout.create(
  process.env.MERCHANT,
  JSON.parse(process.env.SANDBOX)
);

CallbackURL = process.env.CallbackURL;

const createPayment = async (Amount, Mobile, CallbackURL) => {
  return await zarinpal.PaymentRequest({
    Amount, // In Tomans
    CallbackURL,
    Mobile,
    Description: 'پرداخت سامانه رند',
  });
};

module.exports = createPayment;
