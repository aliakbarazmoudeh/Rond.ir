const { BadRequestError } = require("../../errors");
const verifyNationalCode = (nationalCode) => {
  if (typeof nationalCode !== "string")
    throw new BadRequestError("invalid data type for national code");
  let nationalCodeArray = nationalCode.split("").map(Number);
  if (nationalCodeArray.length !== 10)
    throw new BadRequestError("invalid length for national code");

  let controlCode = nationalCodeArray[9];
  nationalCodeArray.pop();
  let sum = 0;
  nationalCodeArray.reverse();
  nationalCodeArray.forEach((number, index) => (sum += number * (index + 2)));
  let mod = sum % 11;
  if (mod < 2) {
    if (mod !== controlCode) throw new BadRequestError("invalid national code");
  } else {
    if (controlCode !== 11 - mod)
      throw new BadRequestError("invalid national code");
  }
  return true;
};

const verifyNationalID = (nationalID) => {
  if (typeof nationalID !== "string")
    throw new BadRequestError("invalid data type for national id");
  let nationalIDArray = nationalID.split("").map(Number);
  if (nationalIDArray.length !== 11)
    throw new BadRequestError("invalid length for national id");

  let controlCode = nationalIDArray[10];
  let decimal = nationalIDArray[9] + 2;
  nationalIDArray.pop();
  let sum = 0;
  const ratioArray = [29, 27, 23, 19, 17, 29, 27, 23, 19, 17];
  nationalIDArray.forEach((number, index) => {
    sum += (number + decimal) * ratioArray[index];
  });
  let mod = sum % 11;
  mod === 10 ? (mod = 0) : null;
  if (mod !== controlCode) throw new BadRequestError("invalid national id");
  return true;
};

module.exports = { verifyNationalCode, verifyNationalID };
