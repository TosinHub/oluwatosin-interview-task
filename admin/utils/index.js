const request = require("request");

function promisifyRequest(url) {
  return new Promise((resolve, reject) => {
    request({ url, json: true }, (error, response, body) => {
      if (error) {
        return reject(error);
      }
      if (response.statusCode !== 200) {
        return reject(
          new Error(
            `Failed to fetch data from ${url}, status code: ${response.statusCode}`
          )
        );
      }
      return resolve(body);
    });
  });
}

module.exports = {
  promisifyRequest,
};
