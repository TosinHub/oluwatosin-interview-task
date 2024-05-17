const config = require("config");
const R = require("ramda");
const { promisifyRequest } = require("./index");

// Cache for storing fetched company details
const companyCache = {};

/**
 * Clears the company cache every hour to prevent stale data.
 */
function startCacheClearInterval() {
  const hour = 3600000;
  setInterval(() => {
    R.keys(companyCache).forEach((key) => delete companyCache[key]);
  }, hour);
}

/**
 * Collects unique company IDs from the given investments.
 * @param {Array} investments - The investments to collect unique company IDs from.
 * @returns {Set} - A set of unique company IDs.
 */
function collectUniqueCompanyIds(investments) {
  return new Set(
    R.pipe(R.pluck("holdings"), R.flatten, R.pluck("id"))(investments)
  );
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

// Starts when service server starts running
startCacheClearInterval();

module.exports = {
  collectUniqueCompanyIds,
  fetchCompanyDetails,
  companyCache,
};
