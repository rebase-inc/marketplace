import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR, UNAUTHORIZED } from '../constants/RequestConstants';

let initialGithubAccounts = { items: new Map(), isFetching: false };

// TODO: Switch to using ImmutableJS
export default function githubAccounts(githubAccounts = initialGithubAccounts, action) {
    switch (action.type) {
        case ActionConstants.LOGIN: return handleNewUserData(action.status, githubAccounts, action.response.user); break;
        case ActionConstants.GET_GITHUB_ACCOUNTS: {
            switch (action.status) {
                case PENDING: return Object.assign({}, githubAccounts, { isFetching: true }); break;
                case SUCCESS:
                    return { isFetching: false, items: new Map(action.response.github_accounts.map(ga => [ga.id, ga])) };
                    break;
            }
        }
        case ActionConstants.GET_IMPORTABLE_REPOS: {
            // this whole block of code is a horrible hack
            switch (action.status) {
                case PENDING: return Object.assign({}, githubAccounts, { isFetching: true }); break;
                case SUCCESS:
                    // this is embarassing...but right now there's no way to know which account we're talking about
                    // so, for now, we're going to append the importable repos to every account! TODO: fix
                    const newAccounts = Array.from(githubAccounts.items.values()).map(a => Object.assign({}, a, {repos: action.response.repos}));
                    return { isFetching: false, items: new Map(newAccounts.map(ga => [ga.id, ga])) };
                    break;
            }
        }
        default: return githubAccounts; break;
    }
}

function handleNewUserData(requestStatus, githubAccounts, user) {
    return githubAccounts; // temporarily not sure if we actually want to load github account data on login
    switch (requestStatus) {
        case PENDING: return Object.assign({}, githubAccounts, { isFetching: true }); break;
        case ERROR: return Object.assign({}, githubAccounts, { isFetching: false }); break;
        case UNAUTHORIZED: return Object.assign({}, githubAccounts, { isFetching: false }); break;
        case SUCCESS:
            return { isFetching: false, items: new Map(user.github_accounts.map(ga => [ga.id, ga])) };
            break;
    }
}
