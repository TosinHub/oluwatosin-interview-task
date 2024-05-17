const config = require("config");

const {
  fetchCompanyDetails,
  collectUniqueCompanyIds,
  companyCache,
} = require("../utils/helpers");
const { promisifyRequest } = require("../utils/");
jest.mock("../utils/");

describe("Company Details Fetcher", () => {
  beforeEach(() => {
    // Clear the cache before each test
    for (const key in companyCache) {
      delete companyCache[key];
    }

    // Clear all mocks before each test
    jest.resetAllMocks();
  });

  it("should return cached company details without making a new request", async () => {
    companyCache["1"] = { id: "1", name: "Cached Company" };
    const result = await fetchCompanyDetails("1");
    expect(promisifyRequest).not.toHaveBeenCalled();
    expect(result).toEqual({ id: "1", name: "Cached Company" });
    
  });

  it("should fetch company details and cache them", async () => {
    const mockCompany = { id: "1", name: "Test Company" };
    promisifyRequest.mockResolvedValue(mockCompany);
    const result = await fetchCompanyDetails("1");
    expect(promisifyRequest).toHaveBeenCalledWith(
      `${config.financialCompaniesServiceUrl}/companies/1`
    );
    expect(result).toEqual(mockCompany);
    expect(companyCache["1"]).toEqual(mockCompany);
  });

  it("should handle errors when fetching company details", async () => {
    promisifyRequest.mockRejectedValue(new Error("Failed to fetch"));
    const result = await fetchCompanyDetails("1");
    expect(result).toEqual({ id: "1", name: "Unknown Holding" });
  });
});

describe("Unique Company ID Collector", () => {
  it("should collect unique company IDs from multiple investments", () => {
    const investments = [
      { holdings: [{ id: "1" }, { id: "2" }] },
      { holdings: [{ id: "2" }, { id: "3" }] },
    ];
    const uniqueIds = collectUniqueCompanyIds(investments);
    expect(uniqueIds).toEqual(new Set(["1", "2", "3"]));
  });
});
