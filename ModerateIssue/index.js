const octokit = require("@octokit/rest");
const jsonwebtoken = require("jsonwebtoken");

const appId = process.env["APP_ID"];
const pem = process.env["APP_PEM"];

function generateJwtToken() {
  // Sign with RSA SHA256
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

// function postIssueComment(
//   installationId,
//   owner,
//   repository,
//   number,
//   action
// ) {
//   console.log(`generate jwt token`);
//   await octokit.authenticate({
//     type: "app",
//     token: generateJwtToken()
//   });

//   console.log(`generate installation token ${installationId}`);
//   const {
//     data: { token }
//   } = await octokit.apps.createInstallationToken({
//     installation_id: installationId
//   });

//   console.log(`authenticate with token`);
//   octokit.authenticate({ type: "token", token });

//   var result = await octokit.issues.createComment({
//     owner,
//     repo: repository,
//     number,
//     body: `Updated function for Azure Functions demo for action ${action} and appId ${appId}.`
//   });
//   return result;
// }

module.exports = function(context, data) {
  context.log("GitHub Webhook triggered!", data.comment.body);
  context.res = { body: "New GitHub comment: " + data.comment.body };
  context.log(data);

  // Synchronous operation
  octokit.authenticate({
    type: "app",
    token: generateJwtToken()
  });

  context.log("Then", a, b);
  context.res = {
    body: { text: "Response here" },
    headers: { "Content-Type": "application/json" }
  };

  context.done();
  /*
  const stringBody = JSON.stringify(data);
  const body = JSON.parse(stringBody);

  const action = body.action;
  const number = body.issue.number;
  const repository = body.repository.name;
  const owner = body.repository.owner.login;
  const installationId = body.installation.id; //get from webhook payload

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
  */
};
