const config = require("config");
const { promisifyRequest } = require("./index");

/**
 * Collects unique company IDs from the given investments.
 * @param {Array} investments - The investments to collect unique company IDs from.
 * @returns {Set} - A set of unique company IDs.
 */
function collectUniqueCompanyIds(investments) {
  const uniqueIds = new Set();
  investments.forEach((investment) => {
    investment.holdings.forEach((holding) => {
      uniqueIds.add(holding.id);
    });
  });
  return uniqueIds;
}

module.exports = {
  collectUniqueCompanyIds,
};
