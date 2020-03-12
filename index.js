const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');

try {
    const skipUnitTests = core.getInput('skip-unit-tests');
    const skipSonarCloudAnalysis = core.getInput('skip-sonar-cloud-analysis');
    const sonarCloudAuthToken = core.getInput('sonar-cloud-auth-token');
    const skipNugetPackaging = core.getInput('skip-nuget-packaging');

    const configurationSettings = 'Configuration settings:\n' + 
                        'Skipping unit tests?: ' + getHumanReadableBoolean(skipUnitTests) + '\n' +
                        'Skipping SonarCloud analysis?: ' + getHumanReadableBoolean(skipSonarCloudAnalysis) + '\n' +
                        'Skipping NuGet packaging?: '; + getHumanReadableBoolean(skipNugetPackaging);

    core.setOutput('configuration-settings', configurationSettings);

    //we may need the payload later
    //const payload = JSON.stringify(github.content.payload, undefined, 2);

    var args;

    if(skipUnitTests) {
        args.push('--skip-unit-tests');
    }

    if(skipSonarCloudAnalysis) {
        args.push('--skip-sonar-cloud-analysis');
    }
    else {
        args.push('--sonar-cloud-auth-token ' + sonarCloudAuthToken);
    }

    if(skipNugetPackaging) {
        args.push('skip-nuget-packaging');
    }

    await exec.exec('"/scripts/ci.sh"', args);

} catch (error) {
    core.setFailed(error.message);
}

function getHumanReadableBoolean(input) {
    return input ? "yes" : "no";
}