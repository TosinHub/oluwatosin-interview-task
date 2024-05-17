const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const request = require("request");
const { promisifyRequest } = require("../utils/");
const {
  fetchCompanyDetails,
  collectUniqueCompanyIds,
  companyCache,
} = require("../utils/helpers");

const app = express();

app.use(bodyParser.json({ limit: "10mb" }));

app.get("/investments/:id", (req, res) => {
  const { id } = req.params;
  request.get(
    `${config.investmentsServiceUrl}/investments/${id}`,
    (e, r, investments) => {
      if (e) {
        console.error(e);
        res.send(500);
      } else {
        res.send(investments);
      }
    }
  );
});

app.get("/generate-csv", async () => {
  try {
    const investments = await promisifyRequest(
      `${config.investmentsServiceUrl}/investments`
    );

    const uniqueCompanyIds = collectUniqueCompanyIds(investments);
    // Fetch details of all unique company ids
    for (const id of uniqueCompanyIds) {
      await fetchCompanyDetails(id);
    }

    // Generate CSV
    let csv = "|User|First Name|Last Name|Date|Holding|Value|\n";
    investments.forEach((investment) => {
      investment.holdings.forEach((holding) => {
        const company = companyCache[holding.id];
        const value = investment.investmentTotal * holding.investmentPercentage;
        csv += `|${investment.userId}|${investment.firstName}|${
          investment.lastName
        }|${investment.date}|${company.name}|${value.toFixed(2)}|\n`;
      });
    });

    // Send CSV to the investments /export route as JSON
    request(
      {
        url: `${config.investmentsServiceUrl}/investments/export`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csv }),
      },
      (error) => {
        if (error) {
          throw Error(error);
        }

        // Send CSV to the investments /export route as JSON
        request(
          {
            url: `${config.investmentsServiceUrl}/investments/export`,
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ csv }),
          },
          (error) => {
            if (error) {
              throw Error(error);
            }
            // Return CSV as text/csv to admin
            res.header("Content-Type", "text/csv");
            res.send(csv);
          }
        );
      }
    );
  } catch (error) {
    console.error("Error generating CSV", error);
    res.status(500).send("Error generating CSV");
  }
});

app.listen(config.port, (err) => {
  if (err) {
    console.error("Error occurred starting the server", err);
    process.exit(1);
  }
  console.log(`Server running on port ${config.port}`);
});
