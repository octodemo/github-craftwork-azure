require 'octokit'
require 'json'
require 'cld'

# Set access_token instead of login and password if you use personal access token
client = Octokit::Client.new(:access_token => ENV['GITHUB_COM_ACCESS_TOKEN'])

luisApp = {"luis_schema_version" => "3.1.0",
    "versionId" => "0.3",
    "name" => "TriageIssues",
    "desc" => "App to triage new issues",
    "culture" => "en-us",
    "intents" => [{"name" => "Bug"},{"name" => "Question"},{"name" => "Enhancement"},{"name" => "None"}],
    "entities" => [],
    "composites" => [],
    "closedLists" => [],
    "patternAnyEntities" => [],
    "regex_entities" => [],
    "prebuiltEntities" => [],
    "model_features" => [],
    "regex_features" => [],
    "patterns" => []
}

utterances = []

for label in ['bug', 'enhancement', 'question']
    page = 1
    10.times do
        issues = client.search_issues("label:#{label}", page: page)
        for expression in issues['items'] do

             if CLD.detect_language(expression['title'])[:code] == 'en'
                item = {
                    'text' => expression['title'],
                    'intent' => label.capitalize,
                    'entities' => []    
                }
                utterances << item
            end
        end
        page += 1
    end
end

luisApp["utterances"] = utterances

luisApp["settings"] = [] 

File.write("triage-issues-app.json", JSON.pretty_generate(luisApp, :indent => "\t"))
