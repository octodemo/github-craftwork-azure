// Set these in your Azure Function Application Settings
const appId = process.env["APP_ID"];
const installationId = process.env["APP_INST_ID"];
const pem = process.env["APP_PEM"];

const octokit = require("@octokit/rest");
const jsonwebtoken = require("jsonwebtoken");
module.exports = function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  context.log("Node version:", process.version);

  if (req.query.name || (req.body && req.body.name)) {
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: "Hello " + (req.query.name || req.body.name)
    };
  } else {
    context.res = {
      status: 400,
      body: "Please pass a name on the query string or in the request body"
    };
  }
  context.done();
};
