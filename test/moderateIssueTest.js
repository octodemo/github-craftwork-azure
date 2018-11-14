var sinon = require("sinon");
var proxyquire = require("proxyquire");
var issueOpenedPayload = require("./fixtures/issue-opened.json");


describe("ModerateIssue", () => {
  var moderateIssue
  var defaultLabel;
  
  before(() => {
    createCommentStub = sinon.spy()
    addLabelsStub = sinon.spy()

    octoKitStubs = {
      issues: {
        addLabels: addLabelsStub,
        createComment: createCommentStub
      }

    }

    defaultLabel = 'question'
    moderateIssue = proxyquire("../ModerateIssue/index", {
      '@octokit/rest': () => octoKitStubs,
      './authenticate': () => true,
      './get-luis-intent': () => new Promise(resolve => resolve(defaultLabel))
    });
  });

  it("should create comment when issue is opened", async () => {
    await moderateIssue({}, { body: issueOpenedPayload });

    sinon.assert.calledWith(addLabelsStub, {
      labels: [defaultLabel],
      number: issueOpenedPayload.issue.number,
      owner: issueOpenedPayload.repository.owner.login,
      repo: issueOpenedPayload.repository.name
    });
  });
});
