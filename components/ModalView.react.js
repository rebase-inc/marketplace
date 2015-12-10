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
import AddSSHKeyModal from './AddSSHKeyModal.react';


import * as ModalConstants from '../constants/ModalConstants';

import * as UserActions from '../actions/UserActions';
import * as TicketActions from '../actions/TicketActions';
import * as AuctionActions from '../actions/AuctionActions';
import * as ContractActions from '../actions/ContractActions';
import * as MediationActions from '../actions/MediationActions';

// might be worth expanding this into four components (TicketModal, AuctionModal, ContractModal, ReviewModal)
// so that we don't have to over-connect the state into this component. Not 100% sure it would work well, but
// it's worth looking into.
export default class ModalView extends Component {
    render() {
        const { modal, user, role } = this.props;
        const { userActions, ticketActions, auctionActions, contractActions, mediationActions } = this.props;
        const { ticketID, tickets, auctionID, auctions, contractID, contracts } = this.props;
        const work = contracts.items.getIn([contractID, 'bid', 'work_offers', 0, 'work']);
        switch (modal.type) {
            case null: return null; break;
            case undefined: return null; break;
            case ModalConstants.CREATE_TICKET_MODAL:
                return <NewTicketModal project={role.project}
                        createInternalTicket={ticketActions.createInternalTicket}
                        createGithubTicket={ticketActions.createGithubTicket}
                        close={userActions.closeModal} />;
            case ModalConstants.CREATE_AUCTION_MODAL:
                const ticket = tickets.items.get(ticketID).toJS();
                const createAuction = ticketActions.createAuction.bind(null, ticket);
                return <CreateAuctionModal isLoading={ticket.isFetching} close={userActions.closeModal} create={createAuction}/>;
            case ModalConstants.BID_MODAL:
                const auction = auctions.items.get(auctionID).toJS();
                const bid = auctionActions.bidOnAuction.bind(null, user, auction);
                return <BidModal auction={auction} bid={bid} close={userActions.closeModal} actions={auctionActions} role={role}/>;
            case ModalConstants.SUBMIT_WORK_MODAL:
                const submitWork = contractActions.submitWork.bind(null, work.toJS());
                return <SubmitWorkModal close={userActions.closeModal} submitWork={submitWork} />; break;
            case ModalConstants.ACCEPT_WORK_MODAL:
                const acceptWork = contractActions.acceptWork.bind(null, work.toJS());
                return <AcceptWorkModal close={userActions.closeModal} acceptWork={acceptWork} />; break;
            case ModalConstants.DISPUTE_WORK_MODAL:
                const disputeWork = contractActions.disputeWork.bind(null, work.toJS());
                return <DisputeWorkModal close={userActions.closeModal} disputeWork={disputeWork} />; break;
            case ModalConstants.UNBLOCK_WORK_MODAL:
                const markWorkUnblocked = contractActions.markWorkUnblocked.bind(null, work.toJS());
                return <ResumeWorkModal close={userActions.closeModal} markWorkUnblocked={markWorkUnblocked} role={role}/>; break;
            case ModalConstants.BLOCK_WORK_MODAL:
                const markWorkBlocked = contractActions.markWorkBlocked.bind(null, work.toJS());
                return <HaltWorkModal close={userActions.closeModal} markWorkBlocked={markWorkBlocked} />; break;
            case ModalConstants.ADD_SSH_KEY_MODAL:
                return <AddSSHKeyModal addSSHKey={userActions.addSSHKey.bind(null, user)} close={userActions.closeModal} />; break;
            case ModalConstants.RESOLVE_MEDIATION_MODAL: {
                let mediations = work.toJS().mediations;
                let mediation = mediations[mediations.length-1];
                return <ResolveMediationModal close={userActions.closeModal}
                    role={role}
                    mediation={mediation}
                    sendAnswer={mediationActions.sendAnswer}
                    resolveMediation={() => alert('oops')}
                />; break;
            }
            default:
                console.warn('Invalid modal type! ', modal.type);
                return null;
        }
    }
}

let mapStateToProps = state => ({
    modal: state.modal,
    tickets: state.tickets,
    ticketID: state.ticketID,
    auctions: state.auctions,
    auctionID: state.auctionID,
    contracts: state.contracts,
    contractID: state.contractID,
});
let mapActionsToProps = dispatch => ({
    userActions: bindActionCreators(UserActions, dispatch),
    ticketActions: bindActionCreators(TicketActions, dispatch),
    auctionActions: bindActionCreators(AuctionActions, dispatch),
    contractActions: bindActionCreators(ContractActions, dispatch),
    mediationActions: bindActionCreators(MediationActions, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(ModalView);
