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
        default:
            return auction;
    }
}
