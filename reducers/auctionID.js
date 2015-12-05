import ActionConstants from '../constants/ActionConstants';
import { PENDING, SUCCESS, ERROR } from '../constants/RequestConstants';
import { OFFERED } from '../constants/ViewConstants';

let initialAuctionID = null;

export default function auctionID(auctionID = initialAuctionID, action) {
    switch (action.type) {
        case ActionConstants.SELECT_AUCTION: return action.response.auctionId; break;
        case ActionConstants.BID_ON_AUCTION: return handleNewAuction(action.status, auctionID, action.response.auction); break;
        case ActionConstants.CREATE_AUCTION: return handleNewAuction(action.status, auctionID, action.response.auction); break;
        case ActionConstants.SELECT_ROLE: return handleNewRole(action.status, auctionID); break;
        case ActionConstants.SELECT_VIEW: return (action.response.viewType == OFFERED) ? initialAuctionID : auctionID; break;
        case ActionConstants.LOGOUT: return initialAuctionID; break;
        default: return auctionID; break;
    }
}

function handleNewRole(requestStatus, oldAuctionID) {
    switch (requestStatus) {
        case PENDING: return oldAuctionID; break;
        case ERROR: return oldAuctionID; break;
        case SUCCESS: return initialAuctionID; break;
    }
}

function handleNewAuction(requestStatus, oldAuctionID, newAuction) {
    switch (requestStatus) {
        case PENDING: return oldAuctionID; break;
        case ERROR: return oldAuctionID; break;
        case SUCCESS: return newAuction.id; break;
    }
}