
# GitHub Craftwork on Azure – Workshop
This README contains the accompanying instructions for the follow-along workshop. Follow the steps below in order to build your first GitHub App, an automated GitHub issue moderator bot, running on Azure Functions and deployed via Azure DevOps Pipelines.

## Prerequisites

A GitHub account, an Azure account and a browser are the only mandatory requirements.

Please note: For the Azure DevOps Pipelines integration to work, only a GitHub Account is needed. However for the Azure Function Apps deployment to work, you are going to need a separate Azure account. Although a free trial version with a time restriction is available for Azure Functions, it signup page seems to have stopped working (see https://github.com/projectkudu/TryAppService/issues/87). It may be possible to remove the requirement on an Azure account if that resumes working at a later point.

## Instructions

Ensure you have a working GitHub account, and [an Azure account with an active subscription](https://signup.azure.com ) (a free trial is available during signup, but a phone number and a credit card are **required** although no money will exchanged ).

## Step 1. Fork repository and install Pipelines

1. Log in on GitHub
2. Fork this repository: https://github.com/pierluigi/github-craftwork-azure
3. Enable `Issues` (under Settings)
4. Go to [Azure Pipelines · GitHub Marketplace · GitHub](https://github.com/marketplace/azure-pipelines)
	1. Select the `Free` plan
	2. Click `Install it for free`
5. Install Pipelines selecting the newly created repo in the dropdown
	1. Sign into your Azure credentials
	2. Create a new Organization for the Pipelines project
	3. Pick a region close to you
	4. Name yopur Pipelines project something like `github-craftwork-azure`
6. The Azure Pipelines project is now set up and integrated with your GitHub repository.
	1. Select the repository for creating the new pipeline
	2. Do not modify the pipeline definition YAML file
	3. Click RUN and wait until the build finishes successfully
	
💡Congrats! You have integrated an automated CI build tool using Azure DevOps Pipelines on your repository.

## Step 2. Create a Function App project on the Azure Portal

Our next step will be to create the Azure Function App that will host our code.

1. Log in on the [Microsoft Azure portal](https://portal.azure.com/)
2. Click on `Create` -> `Compute` -> `Function App`

<img src="readme/BC9B4CDC-4C1D-4009-83F7-7D52B185FA3E.png" width="400" >

*Our function configuration*

3. Confirm and wait for the new resource to be deployed.


## Step 3. Enable automatic deployment from GitHub

Let's go back to [Azure Pipelines](https://dev.azure.com).

1. Click on Releases
	1. New Pipeline
	2. Azure App Service deployment
		1. Create “Deploy to Azure Functions” stage

		3. Click on the job/task link in the UI
		4. Fill the subscription form -> Authorize
			1. Wait for `Configuring the Azure service connection...` to disappear
		5. Select your Function App from the 2nd dropdown
		6. Save (top right)
		7. Select the build pipeline as a source for the Artifact 
![](readme/486F6C94-DE01-45FC-B718-97B83DFB3017.png)
		8. Enable the Continuous deployment trigger

1. Go back to Builds
	1. Click on Queue build
		1. This will create a new release artifact
		2. Wait for the build to finish
![](readme/B224C33F-288B-4530-B8EB-29363E2895D1.png)

![](readme/7C8657FD-2FAE-410A-BAC5-45895144668E.png)

2. Back to Releases, follow the release

![](readme/6DF951A7-650A-4F3D-826E-07621EE9C8EA.png)

3. Verify the function has been deployed in Azure -> Function Apps

![](readme/732755B0-9161-419F-9E22-8B2F608A613E.png)


5. Click on “ModerateIssue”
	1. Click on get URL  copy it somewhere (`https://github-craftwork-pjawesome.azurewebsites.net/api/ModerateIssue?clientId=default`)
	2. Click on get GitHub Secret, copy it somewhere (`98BxXWy3AhoWr2LnMkhsNqsFm905cefiovleA4SYch1hMmFILaMiAA==`)
	
![](readme/9103F5FA-1A99-4680-A3AA-902E805956DD.png)

## Step 4. Create our GitHub App

![](readme/B039EE86-02E4-43B1-87DB-6C5CA8FCF068.png)

https://github.com/settings/developers

![](readme/D302A190-1134-418E-AAA2-158FCCB9B15E.png)

1. Generate APP
2. Download key
3. Save APP ID `18036` and Installation ID
4. Install app on the repo

Now back to Azure Function Apps

1. Select app -> Application Settings
2. Add new setting in the list: APP_ID `YOUR_APP_ID`
3. Add new setting in the list: APP_INST_ID `YOUR_INSTALLATION_ID` (**TODO GET FROM WEBHOOK**)

**Encoding the secret key**
We need to encode our `.pem` certificate using base64 in order to store it as an environment variable.

- if you're on MacOS / Linux: `cat azure-moderate-issue.2018-09-24.private-key.pem | openssl base64 | pbcopy`
- alternatively use https://www.base64decode.org/ 
	
4. Add new setting in the list APP_PEM with the bse64 encoded stirng of your pem
![](readme/1ADDAD91-4F30-43DA-93D3-92ED418F9247.png)



### Reading material

- GitHub App Walkthrough [octokit.net/github-apps.md at master · octokit/octokit.net · GitHub](https://github.com/octokit/octokit.net/blob/master/docs/github-apps.md#github-app-walkthrough) 
- VS CODE functions
[Create your first function in Azure using Visual Studio Code | Microsoft Docs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-create-first-function-vs-code)


