import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialUser = { email: null, isFetching: false };

export default function user(user = initialUser, action) {
    console.log('responding to action ', action);
    switch (action.type) {
        case ActionConstants.LOGIN: {
            switch (action.status) {
                case PENDING: return Object.assign({}, user, { isFetching: true }); break;
                case SUCCESS: return Object.assign({}, user, action.response.user); break;
            }
        }
        default:
            return user;
    }
}
