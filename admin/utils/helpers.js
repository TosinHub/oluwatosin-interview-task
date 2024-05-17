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

/**
 * Fetches company details from the financial companies service.
 * @param {string} id - The ID of the company to fetch.
 * @returns {Promise<Object>} - A promise that resolves to the fetched company details.
 */
async function fetchCompanyDetails(id) {
  if (companyCache[id]) {
    return companyCache[id]; // Return from cache if already fetched
  }
  try {
    const url = `${config.financialCompaniesServiceUrl}/companies/${id}`;
    const companyDetails = await promisifyRequest(url);
    companyCache[id] = companyDetails; // Cache the fetched details
    return companyCache[id];
  } catch (error) {
    console.error(`Failed to fetch company ${id}:`, error);
    return { id, name: "Unknown Holding" }; // Return default on error
  }
}

module.exports = {
  collectUniqueCompanyIds,
  fetchCompanyDetails,
};
