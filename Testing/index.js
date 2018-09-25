// Set these in your Azure Function Application Settings
const appId = process.env["APP_ID"];
const installationId = process.env["APP_INST_ID"];
const pem = process.env["APP_PEM"];

const octokit = require("@octokit/rest");
const jsonwebtoken = require("jsonwebtoken");

module.exports = function(context, data) {
  context.log("Node version:", process.version);
  context.log("Data", data);
  // context.log("GitHub Webhook triggered!", data.comment.body);
  // context.res = { body: "New GitHub comment: " + data.comment.body };
  context.done();
};
