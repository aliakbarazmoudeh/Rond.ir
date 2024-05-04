const ZarinpalCheckout = require('zarinpal-checkout');
const zarinpal = ZarinpalCheckout.create(
  process.env.MERCHANT,
  JSON.parse(process.env.SANDBOX)
);

const verifyPayment = async (Amount, Authority) => {
  return await zarinpal.PaymentVerification({
    Amount,
    Authority,
  });
};

module.exports = verifyPayment;
