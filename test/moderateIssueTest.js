var sinon = require("sinon");
var proxyquire = require("proxyquire");
var issueOpenedPayload = require("./fixtures/issue-opened.json");


describe("ModerateIssue", () => {
  var moderateIssue

  before(() => {

    addLabelsStub = sinon.spy()
    octoKitStubs = {
      issues: {
        addLabels: addLabelsStub,
      }
    };

    moderateIssue = proxyquire("../ModerateIssue/index", {
      "@octokit/rest": () => octoKitStubs,
      "./authenticate": () => true,
      "./get-luis-intent": () => "question"
    });
  });


  it('should assign the enhancement label', async () => {
    await moderateIssue({}, { body: issueOpenedPayload })

    sinon.assert.calledWith(addLabelsStub, {
      labels: ['enhancement', 'question', 'bug'],
      number: issueOpenedPayload.issue.number,
      owner: issueOpenedPayload.repository.owner.login,
      repo: issueOpenedPayload.repository.name
    });
  });
});
