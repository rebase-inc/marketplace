import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { OFFERED } from '../constants/ViewConstants';

let initialAuctionID = null;

// hack to only show available auction. TODO: Add query parameter like ?state=waiting_for_bids or equivalent to api
function _filter(auction) {
    return (auction.state == 'created' || auction.state == 'waiting_for_bids')
}

export default function auctionID(auctionID = initialAuctionID, action) {
    switch (action.type) {
        case ActionConstants.GET_AUCTIONS:
            let auction = action.response.auctions ? action.response.auctions.filter(_filter)[0] : {};
            auction = auction || {};
            return setID(action.status, auctionID, auctionID || auction.id); break;
        case ActionConstants.SELECT_AUCTION: return action.response.auctionId; break;
        case ActionConstants.BID_ON_AUCTION: return removeID(action.status, auctionID, action.response.auction); break;
        case ActionConstants.CREATE_AUCTION: return setID(action.status, auctionID, (action.response.auction || {}).id); break;
        case ActionConstants.SELECT_ROLE: return removeID(action.status, auctionID); break;
        case ActionConstants.LOGOUT: return removeID(action.status, auctionID); break;
        default: return auctionID; break;
    }
}

function removeID(requestStatus, oldAuctionID) {
    switch (requestStatus) {
        case PENDING: return oldAuctionID; break;
        case ERROR: return oldAuctionID; break;
        case SUCCESS: return initialAuctionID; break;
        default: return oldAuctionID; break;
    }
}

function setID(requestStatus, oldAuctionID, newAuctionID) {
    switch (requestStatus) {
        case PENDING: return oldAuctionID; break;
        case ERROR: return oldAuctionID; break;
        case SUCCESS: return newAuctionID || oldAuctionID; break;
        default: return oldAuctionID; break;
    }
}
