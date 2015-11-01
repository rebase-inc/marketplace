import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialGithubAccounts = { items: new Map(), isFetching: false };

export default function githubAccounts(githubAccounts = initialGithubAccounts, action) {
    switch (action.type) {
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
