import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

const initialRoles = { isFetching: false, items: [] };

export default function roles(roles = initialRoles, action) {
    switch (action.type) {
        case ActionConstants.LOGIN: return handleLogin(action.status, roles, action.response.user); break;
        case ActionConstants.IMPORT_GITHUB_REPOS: return handleNewRoles(action.status, roles, action.response.roles); break;
        case ActionConstants.LOGOUT: return initialRoles; break;
        default: return roles; break;
    }
}

function handleLogin(requestStatus, oldRoles, user) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, roles, { isFetching: true }); break;
        case SUCCESS:
            const newRoles = new Map(user.roles.map(role => [role.id, role]));
            return { items: newRoles, isFetching: false };
            break;
        default:
            return oldRoles;
    }

}

function handleNewRoles(requestStatus, oldRoles, newRoles) {
    switch (requestStatus) {
        case PENDING: return Object.assign({}, oldRoles, { isFetching: true }); break;
        case ERROR: return Object.assign({}, oldRoles, { isFetching: false });  break;
        case SUCCESS: {
            for ( let role of newRoles ) {
                oldRoles.items.set(role.id, role);
            }
            return Object.assign({}, oldRoles, { isFetching: false });
        }
        default:
            return oldRoles;
    }
}
