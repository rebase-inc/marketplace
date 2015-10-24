import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

export default function roles(roles = {isFetching: false, items: []}, action) {
    switch (action.type) {
        case ActionConstants.LOGIN: {
            switch (action.status) {
                case PENDING: return Object.assign({}, roles, { isFetching: true }); break;
                case SUCCESS: return Object.assign({}, roles, { isFetching: false }, { items: action.response.user.roles }); break;
            }
        }
        default:
            return roles;
    }
}
