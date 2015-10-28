import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

const initialRoles = { isFetching: false, items: [] };

export default function roles(roles = initialRoles, action) {
    switch (action.type) {
        case ActionConstants.LOGIN: {
            switch (action.status) {
                case PENDING: return Object.assign({}, roles, { isFetching: true }); break;
                case SUCCESS:
                    const newRoles = new Map(action.response.user.roles.map(role => [role.id, role]));
                    return Object.assign({}, roles, { isFetching: false }, { items: newRoles }); break;
            }
        }
        case ActionConstants.LOGOUT: return initialRoles; break;
        default: return roles; break;
    }
}
