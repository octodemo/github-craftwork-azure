// Set these in your Azure Function Application Settings
const appId = process.env["APP_ID"];
const installationId = process.env["APP_INST_ID"];
const pem = process.env["APP_PEM"];

const octokit = require("@octokit/rest");
const jsonwebtoken = require("jsonwebtoken");

function generateJwtToken() {
  // Sign with RSA SHA256
  console.log(`appId = ${appId}`);
  console.log(`pem = ${pem}`);
  return jsonwebtoken.sign(
    {
      iat: Math.floor(new Date() / 1000),
      exp: Math.floor(new Date() / 1000) + 60,
      iss: appId
    },
    pem,
    { algorithm: "RS256" }
  );
}

async function postIssueComment(
  installationId,
  owner,
  repository,
  number,
  action
) {
  console.log(`generate jwt token`);
  await octokit.authenticate({
    type: "app",
    token: generateJwtToken()
  });

  console.log(`generate installation token ${installationId}`);
  const {
    data: { token }
  } = await octokit.apps.createInstallationToken({
    installation_id: installationId
  });

  console.log(`authenticate with token`);
  octokit.authenticate({ type: "token", token });

  var result = await octokit.issues.createComment({
    owner,
    repo: repository,
    number,
    body: `Updated Function for Kubernetes demo for action ${action} and appId ${appId}.`
  });
  return result;
}

module.exports = async function(context) {
  const stringBody = JSON.stringify(context.request.body);
  const body = JSON.parse(stringBody);
  const action = body.action;
  const number = body.issue.number;
  const repository = body.repository.name;
  const owner = body.repository.owner.login;

  try {
    var response = "";
    if (action === "opened") {
      response = await postIssueComment(
        installationId,
        owner,
        repository,
        number,
        action
      );
    }
    return {
      status: 200,
      body: {
        text: response
      },
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (e) {
    return {
      status: 500,
      body: e
    };
  }
};
