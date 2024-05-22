const { BadRequestError } = require("../../errors");
const verifyPhoneNumber = (preCode, number) => {
  const regex =
    /(0|\+98)?([ ]|-|[()]){0,2}9[1|2|3|4]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}/gi;
  let phoneNumber = `0${preCode}${number}`;
  if (!regex.test(phoneNumber))
    throw new BadRequestError("invalid phone number");
  return true;
};

module.exports = { verifyPhoneNumber };
