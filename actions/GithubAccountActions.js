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
    Array.from(githubRepoList).forEach((repo) => data.repos[repo.id] = repo); // hack because api expects weird data format
    return dispatchedRequest('POST', '/github/import_repos', ActionConstants.IMPORT_GITHUB_REPOS, data);
}
