import { LOGIN } from '../constants/ActionConstants';

export default function role(role = {type: null}, action) {
    switch (action.type) {
        case LOGIN: 
            return Object.assign({}, role, { type: 'contractor' }); break;
        default:
            return role;
    }
}
