const octokit = require("@octokit/rest")();
const authenticate = require('./authenticate');
const getLuisIntent = require('./get-luis-intent');

module.exports = async function (context, data) {
  const { body } = data
  const { action, repository, issue, installation } = body;
  const { number, title } = issue;
  const repo = repository.name;
  const owner = repository.owner.login;
  const installationId = installation.id;

  try {
    let response = "";
    if (action === "opened") {
      await authenticate(octokit, installationId)
      response = await octokit.issues.createComment({
        owner, 
        repo, 
        number, 
        body: "Thanks for submitting this issue. We will take a look at it!"
      })
    }
    context.res = {
      status: 200,
      body: response,
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (e) {
    context.log("Error:" ,e);
    context.res = {
      status: 500,
      body: e.message
    };
  }
};