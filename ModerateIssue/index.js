const octokit = require("@octokit/rest")();
const authenticate = require('./authenticate');

module.exports = async function (context, data) {
  const { body } = data
  const { action, repository, issue, installation } = body;
  const { number } = issue;
  const repo = repository.name;
  const owner = repository.owner.login;
  const installationId = installation.id;

  try {
    let response = "";
    if (action === "opened") {
      await authenticate(octokit, installationId)
      response = await octokit.issues.addLabels({
        owner, 
        repo, 
        number, 
        labels: ['enhancement']
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
