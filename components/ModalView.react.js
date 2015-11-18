import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NewTicketModal from './NewTicketModal.react';
import CreateAuctionModal from './CreateAuctionModal.react';
import BidModal from './BidModal.react';

import HaltWorkModal from './HaltWorkModal.react';
import ResumeWorkModal from './ResumeWorkModal.react';
import SubmitWorkModal from './SubmitWorkModal.react';
import AcceptWorkModal from './AcceptWorkModal.react';
import DisputeWorkModal from './DisputeWorkModal.react';
import ResolveMediationModal from './ResolveMediationModal.react';


import * as ModalConstants from '../constants/ModalConstants';

import * as UserActions from '../actions/UserActions';
import * as TicketActions from '../actions/TicketActions';
import * as AuctionActions from '../actions/AuctionActions';
import * as ContractActions from '../actions/ContractActions';

// might be worth expanding this into four components (TicketModal, AuctionModal, ContractModal, ReviewModal)
// so that we don't have to over-connect the state into this component. Not 100% sure it would work well, but
// it's worth looking into.
export default class ModalView extends Component {
    render() {
        const { modal, user, roles } = this.props;
        const { userActions, ticketActions, auctionActions, contractActions } = this.props;
        const { ticket, tickets, auction, auctions, contract, contracts, review } = this.props;
        switch (modal.type) {
            case null: return null; break;
            case undefined: return null; break;
            case ModalConstants.CREATE_TICKET_MODAL:
                return <NewTicketModal project={roles.items.get(user.current_role.id).project}
                        createInternalTicket={ticketActions.createInternalTicket}
                        createGithubTicket={ticketActions.createGithubTicket}
                        close={userActions.closeModal} />;
            case ModalConstants.CREATE_AUCTION_MODAL:
                // the following two lines constitute a hack required because API requires the ticket organization
                const mergedTicket = Object.assign({}, ticket, tickets.items.get(ticket.id)); // Hack pt1: Merge ticket (w/ loading status) and full detailed ticket
                const createAuction = ticketActions.createAuction.bind(null, mergedTicket); // Hack pt2: Use merged ticket to curry createAuction function
                return <CreateAuctionModal isLoading={ticket.isFetching} close={userActions.closeModal} create={createAuction}/>;
            case ModalConstants.BID_MODAL:
                const bid = auctionActions.bidOnAuction.bind(null, user, auctions.items.get(auction.id));
                return <BidModal auction={auctions.items.get(auction.id)} bid={bid} close={userActions.closeModal} actions={auctionActions}/>;
            case ModalConstants.SUBMIT_WORK_MODAL:
                const submitWork = contractActions.submitWork.bind(null, contracts.items.get(contract.id).work);
                return <SubmitWorkModal close={userActions.closeModal} submitWork={submitWork} />; break;
            case ModalConstants.ACCEPT_WORK_MODAL:
                const acceptWork = contractActions.acceptWork.bind(null, contracts.items.get(contract.id).work);
                return <AcceptWorkModal close={userActions.closeModal} acceptWork={acceptWork} />; break;
            case ModalConstants.DISPUTE_WORK_MODAL:
                const disputeWork = contractActions.disputeWork.bind(null, contracts.items.get(contract.id).work);
                return <DisputeWorkModal close={userActions.closeModal} disputeWork={disputeWork} />; break;
            case ModalConstants.UNBLOCK_WORK_MODAL:
                const markWorkUnblocked = contractActions.markWorkUnblocked.bind(null, contracts.items.get(contract.id).work);
                return <ResumeWorkModal close={userActions.closeModal} markWorkUnblocked={markWorkUnblocked} />; break;
            case ModalConstants.BLOCK_WORK_MODAL:
                const markWorkBlocked = contractActions.markWorkBlocked.bind(null, contracts.items.get(contract.id).work);
                return <HaltWorkModal close={userActions.closeModal} markWorkBlocked={() => alert('foo')} />; break;
            case ModalConstants.RESOLVE_MEDIATION_MODAL:
                //const markWorkBlocked = contractActions.markWorkBlocked.bind(null, contracts.items.get(contract.id).work),
                return <ResolveMediationModal close={userActions.closeModal} resolveMediation={() => alert('oops')} />; break;
            default:
                console.warn('Invalid modal type! ', modal.type);
                return null;
        }
    }
}

let mapStateToProps = state => ({
    modal: state.modal,
    ticket: state.ticket,
    tickets: state.tickets,
    auction: state.auction,
    auctions: state.auctions,
    contract: state.contract,
    contracts: state.contracts, 
});
let mapActionsToProps = dispatch => ({
    userActions: bindActionCreators(UserActions, dispatch),
    ticketActions: bindActionCreators(TicketActions, dispatch),
    auctionActions: bindActionCreators(AuctionActions, dispatch),
    contractActions: bindActionCreators(ContractActions, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(ModalView);
