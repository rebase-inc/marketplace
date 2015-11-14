import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';

let initialAuction = { id: null, isFetching: false };

export default function auction(auction = initialAuction, action) {
    switch (action.type) {
        case ActionConstants.SELECT_AUCTION: {
            switch (action.status) {
                case SUCCESS:
                    return { isFetching: false, id: action.response.auctionId }
            }
        }
        case ActionConstants.CREATE_AUCTION: {
            switch (action.status) {
                case PENDING: return Object.assign({}, auction, { isFetching: true }); break;
                case ERROR: return Object.assign({}, auction, { isFetching: false }); break;
                case SUCCESS:
                    return { id: action.response.auction.id, isFetching: false }
                    break;
            }
        }
        case ActionConstants.SELECT_VIEW: {
            switch (action.status) {
                case SUCCESS: return initialAuction; break;
            }
        }
        case ActionConstants.LOGOUT: return initialAuction; break;
        default: return auction;
    }
}
