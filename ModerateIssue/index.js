// Set these in your Azure Function Application Settings
const appId = process.env.APP_ID
const luisAppId = process.env.LUIS_APP_ID;
const endpointKey = process.env.LUIS_ENDPOINT_KEY;

// Decode our secret pem file
const pem = Buffer.from(process.env["APP_PEM"] || "", "base64").toString();

const octokit = require("@octokit/rest")();
const jsonwebtoken = require("jsonwebtoken");
const request = require('request');
const querystring = require('querystring');

const luisEndpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";

// Sign with RSA SHA256
function generateJwtToken() {
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

async function authenticate(installation_id) {
  // Create bearer token and initial authentication session
  await octokit.authenticate({
    type: "app",
    token: generateJwtToken()
  });

  // Retrieve token from app installation
  const { data: { token } } = await octokit.apps.createInstallationToken({ installation_id });

  // Finally authenticate as the app
  return octokit.authenticate({ type: "token", token });
}

function getLuisIntent(utterance) {
  const queryParams = {
    "verbose": true,
    "q": utterance,
    "subscription-key": endpointKey
  }

  const luisRequest = `${luisEndpoint}/${luisAppId}?${querystring.stringify(queryParams)}`;

  return new Promise((resolve, reject) => {
    request(luisRequest, (err, _, body) => {
        if (err) reject(err)
        
        const data = JSON.parse(body);
        resolve(data.topScoringIntent.intent.toLowerCase());
      })
  });
}

async function addLabelsFromTitle(owner, repo, number, title) {
  const label = await getLuisIntent(title);

  return await octokit.issues.addLabels({
    owner,
    repo,
    number,
    labels: [label]
  });
}

module.exports = async function (context, data) {
  const { body } = data
  const { action, repository, issue, installation } = body;
  const { number, title } = issue;
  const repositoryName = repository.name;
  const repositoryOwner = repository.owner.login;
  const installationId = installation.id;

  try {
    let response = "";
    if (action === "opened") {
      await authenticate(installationId)
      response = await addLabelsFromTitle(
        repositoryOwner,
        repositoryName,
        number,
        title
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
    context.log("Error:" ,e);
    context.res = {
      status: 500,
      body: e.message
    };
  }
};