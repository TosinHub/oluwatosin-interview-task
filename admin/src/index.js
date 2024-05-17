const express = require("express");
const bodyParser = require("body-parser");
const config = require("config");
const request = require("request");
const { promisifyRequest } = require("../utils/");
const { collectUniqueCompanyIds } = require("../utils/helpers");

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
