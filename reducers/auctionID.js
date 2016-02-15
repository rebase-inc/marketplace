import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { OFFERED } from '../constants/ViewConstants';

let initialAuctionID = null;

export default function auctionID(auctionID = initialAuctionID, action) {
    switch (action.type) {
        case ActionConstants.GET_AUCTIONS: return setID(action.status, auctionID, auctionID || (action.response.auctions || [{}])[0]); break;
        case ActionConstants.SELECT_AUCTION: return action.response.auctionId; break;
        case ActionConstants.BID_ON_AUCTION: return removeID(action.status, auctionID, action.response.auction); break;
        case ActionConstants.CREATE_AUCTION: return setID(action.status, auctionID, action.response.auction); break;
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

function setID(requestStatus, oldAuctionID, newAuction) {
    switch (requestStatus) {
        case PENDING: return oldAuctionID; break;
        case ERROR: return oldAuctionID; break;
        case SUCCESS: return newAuction.id || oldAuctionID; break;
        default: return oldAuctionID; break;
    }
}
