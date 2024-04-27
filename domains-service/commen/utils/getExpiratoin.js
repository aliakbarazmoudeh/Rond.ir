const getExpiration = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth()).padStart(2, '0');
  const day = String(date.getDate() + 3).padStart(2, '0');
  const formattedDate = `${year}${month}${day}`;
  return parseInt(formattedDate);
};

module.exports = getExpiration;
