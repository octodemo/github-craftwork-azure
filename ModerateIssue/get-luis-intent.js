const luisAppId = process.env.LUIS_APP_ID;
const endpointKey = process.env.LUIS_ENDPOINT_KEY;

module.exports = function (utterance) {
  const request = require('request');
  const querystring = require('querystring');
  
  const luisEndpoint = "https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/";

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
