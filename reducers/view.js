import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { NEW, OFFERED, IN_PROGRESS, COMPLETED } from '../constants/ViewConstants';
import { FAILED } from '../constants/WorkStates';

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
        case ActionConstants.BID_ON_AUCTION: {
            switch (action.status) {
                case PENDING: return Object.assign({}, view, { isFetching: true }); break;
                case ERROR: return Object.assign({}, view, { isFetching: false }); break;
                case SUCCESS: return action.response.auction.bids.find(bid => bid.contract) !== undefined ? { isFetching: false, type: IN_PROGRESS } : view;
            }
        }
        case ActionConstants.ACCEPT_WORK: {
            switch (action.status) {
                case PENDING: return Object.assign({}, view, { isFetching: true }); break;
                case ERROR: return Object.assign({}, view, { isFetching: false }); break;
                case SUCCESS: return { isFetching: false, type: COMPLETED }; break;
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
