import ActionConstants from '../constants/ActionConstants';

import { dispatchedRequest } from '../utils/Api';
import { SUCCESS } from '../constants/RequestConstants';

export function getGithubAccounts() {
    return dispatchedRequest('GET', '/github_accounts', ActionConstants.GET_GITHUB_ACCOUNTS);
}

export function getImportableRepos(githubAccount) {
    const url = '/github_accounts/' + githubAccount.id + '/importable_repos';
    return dispatchedRequest('GET', url, ActionConstants.GET_IMPORTABLE_REPOS);
}

export function importGithubRepos(githubRepoList) {
    const data = { repos: {} };
    // assumes githubRepoList is a map of id=>repo
    for ( let [id, repo] of githubRepoList ) {
        data.repos[id] = repo;
    }
    return dispatchedRequest('POST', '/github/import_repos', ActionConstants.IMPORT_REPOS, data);
}
