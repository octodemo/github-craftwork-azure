const appId = process.env.APP_ID

const pem = Buffer.from(process.env["APP_PEM"] || "", "base64").toString();

const jsonwebtoken = require("jsonwebtoken");

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

module.exports = async function (octokit, installation_id) {
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
