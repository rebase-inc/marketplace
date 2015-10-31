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
        default: return githubAccounts; break;
    }
}
