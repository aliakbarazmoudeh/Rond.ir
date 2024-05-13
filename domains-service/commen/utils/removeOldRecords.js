const query = (table, column) => {
  return `
CREATE EVENT IF NOT EXISTS removeold_hourly
ON SCHEDULE EVERY 1 HOUR
COMMENT 'Remove items that expired'
DO
DELETE FROM ${table} WHERE ${column} < CURDATE();
`;
};

module.exports = { query };
