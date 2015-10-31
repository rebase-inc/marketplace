import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { NEW, OFFERED, IN_PROGRESS, COMPLETED } from '../constants/ViewConstants';

const initialView = { isFetching: false, type: OFFERED };

export default function view(view = initialView, action) {
    switch (action.type) {
        case ActionConstants.LOGIN: {
            switch (action.status) {
                case PENDING: return Object.assign({}, view, { isFetching: true }); break;
                case SUCCESS:
                    let newView = {};
                    switch (action.response.user.current_role.type) {
                        case 'manager': newView.type = NEW; break;
                        case 'contractor': newView.type = OFFERED; break;
                    }
                    return Object.assign({}, view, { isFetching: false }, newView);
                    break;
            }
        }
        case ActionConstants.SELECT_VIEW: {
            switch (action.status) {
                case PENDING: return Object.assign({}, view, { isFetching: true }); break;
                case SUCCESS:
                    return Object.assign({}, view, { isFetching: false }, { type: action.response.viewType });
                    break;
            }
        }
        case ActionConstants.CREATE_AUCTION: {
            switch (action.status) {
                case PENDING: return Object.assign({}, view, { isFetching: true }); break;
                case SUCCESS:
                    return Object.assign({ isFetching: false }, { type: OFFERED });
                    break;
            }
        }
        case ActionConstants.LOGOUT: return initialView; break;
        default: return view; break;
    }
}
