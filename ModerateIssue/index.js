// Set these in your Azure Function Application Settings
const appId = process.env["APP_ID"] || "";
// Decode our secret pem file
const pem = Buffer.from(process.env["APP_PEM"] || "", "base64").toString();

const octokit = require("@octokit/rest")();
const jsonwebtoken = require("jsonwebtoken");

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

function getLuisIntent(utterance) {

  const endpoint =
    "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";

  const luisAppId = process.env.LUIS_APP_ID;

  var queryParams = {
    "verbose": true,
    "q": utterance
  }

  var luisRequest =
    endpoint + luisAppId +
    '?' + querystring.stringify(queryParams);

    return new Promise((resolve, reject) => {
      request(luisRequest,
      function (err,
        response, body) {

        if (err)
          reject(err)
        else {
          var data = JSON.parse(body);
          resolve(data.topScoringIntent.intent.toLowerCase());
        }
      })
    }
    );
}

async function addLabels(
  installationId,
  owner,
  repository,
  number,
  action,
  title
) {
  // Create bearer token and initial authentication session
  await octokit.authenticate({
    type: "app",
    token: generateJwtToken()
  });

  // Retrieve token from app installation
  const {
    data: { token }
  } = await octokit.apps.createInstallationToken({
    installation_id: installationId
  });

  // Finally authenticate as the app
  octokit.authenticate({ type: "token", token });

  const label = await getLuisIntent(title);

  var result = await octokit.issues.addLabels({
    owner,
    repo: repository,
    number,
    labels: [label]
  });
  return result;
}

module.exports = async function(context, data) {
  const body = data.body;
  const action = body.action;
  const number = body.issue.number;
  const title = body.issue.title;
  const repository = body.repository.name;
  const owner = body.repository.owner.login;
  const installationId = body.installation.id;

  try {
    var response = "";
    if (action === "opened") {
      response = await addLabels(
        installationId,
        owner,
        repository,
        number,
        title,
        action
      );
    }
    context.res = {
      status: 200,
      body: response,
      headers: {
        "Content-Type": "application/json"
      }
    };
  } catch (e) {
    context.log(e);
    context.res = {
      status: 500,
      body: e.message
    };
  }
};
