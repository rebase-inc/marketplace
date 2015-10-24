import { LOGIN } from '../constants/ActionConstants';
import { ERROR, PENDING, SUCCESS } from '../constants/ActionConstants';

let initialUser = { email: null, isFetching: false };

export default function user(user = initialUser, action) {
    console.log("responding to action ", action);
    switch (action.type) {
        case LOGIN: {
            switch (action.status) {
                case PENDING: return Object.assign({}, user, { isFetching: true }); break;
                case SUCCESS: return Object.assign({}, user, action.user); break;
            }
        }
        default:
            return user;
    }
}
