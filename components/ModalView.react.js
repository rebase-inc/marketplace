import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import NewTicketModal from './NewTicketModal.react';
import CreateAuctionModal from './CreateAuctionModal.react';
import BidModal from './BidModal.react';

import AcceptWorkModal from './AcceptWorkModal.react';
import AddSSHKeyModal from './AddSSHKeyModal.react';
import DisputeWorkModal from './DisputeWorkModal.react';
import HaltWorkModal from './HaltWorkModal.react';
import ProjectSelectionModal from './ProjectSelectionModal.react';
import ResolveMediationModal from './ResolveMediationModal.react';
import ResumeWorkModal from './ResumeWorkModal.react';
import SubmitWorkModal from './SubmitWorkModal.react';

import * as ModalConstants from '../constants/ModalConstants';

import * as UserActions from '../actions/UserActions';
import * as TicketActions from '../actions/TicketActions';
import * as AuctionActions from '../actions/AuctionActions';
import * as ContractActions from '../actions/ContractActions';

import { getContractWork } from '../utils/getters';

// might be worth expanding this into four components (TicketModal, AuctionModal, ContractModal, ReviewModal)
// so that we don't have to over-connect the state into this component. Not 100% sure it would work well, but
// it's worth looking into.
export default class ModalView extends Component {
    render() {
        const { modal, user, role, roles } = this.props;
        const { userActions, ticketActions, auctionActions, contractActions, mediationActions } = this.props;
        const { auction, auctions, contract, contracts, fetchingTickets, ticket, tickets } = this.props;
        const work = contract ? getContractWork(contract) : null;
        switch (modal.type) {
            case null: return null; break;
            case undefined: return null; break;
            case ModalConstants.CREATE_TICKET_MODAL:
                return <NewTicketModal project={role.project}
                        createInternalTicket={ticketActions.createInternalTicket}
                        createGithubTicket={ticketActions.createGithubTicket}
                        close={userActions.closeModal} />;
            case ModalConstants.CREATE_AUCTION_MODAL:
                const createAuction = ticketActions.createAuction.bind(null, ticket);
                return <CreateAuctionModal isLoading={fetchingTickets} close={userActions.closeModal} create={createAuction}/>;
            case ModalConstants.BID_MODAL:
                const bid = auctionActions.bidOnAuction.bind(null, user, auction);
                return <BidModal auction={auction} bid={bid} close={userActions.closeModal} actions={auctionActions} role={role}/>;
            case ModalConstants.SUBMIT_WORK_MODAL:
                const submitWork = contractActions.submitWork.bind(null, work);
                return <SubmitWorkModal close={userActions.closeModal} submitWork={submitWork} />; break;
            case ModalConstants.ACCEPT_WORK_MODAL:
                const acceptWork = contractActions.acceptWork.bind(null, work);
                return <AcceptWorkModal close={userActions.closeModal} acceptWork={acceptWork} />; break;
            case ModalConstants.DISPUTE_WORK_MODAL:
                const disputeWork = contractActions.disputeWork.bind(null, work);
                return <DisputeWorkModal close={userActions.closeModal} disputeWork={disputeWork} />; break;
            case ModalConstants.UNBLOCK_WORK_MODAL:
                const markWorkUnblocked = contractActions.markWorkUnblocked.bind(null, work);
                return <ResumeWorkModal close={userActions.closeModal} markWorkUnblocked={markWorkUnblocked} role={role}/>; break;
            case ModalConstants.BLOCK_WORK_MODAL:
                const markWorkBlocked = contractActions.markWorkBlocked.bind(null, work);
                return <HaltWorkModal close={userActions.closeModal} markWorkBlocked={markWorkBlocked} />; break;
            case ModalConstants.ADD_SSH_KEY_MODAL:
                return <AddSSHKeyModal addSSHKey={userActions.addSSHKey.bind(null, user)} close={userActions.closeModal} />; break;
            case ModalConstants.SELECT_PROJECT:
                return <ProjectSelectionModal
                    close={userActions.closeModal}
                    project={role.project}
                    projects={Array.from(roles.items.values()).filter(r => r.type == 'manager').map(r => r.project)}
                    select={userActions.selectRole.bind(null, user)}
                />;
            case ModalConstants.RESOLVE_MEDIATION_MODAL: {
                let mediations = work.mediations;
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
    auction: state.auctions.items.get(state.auctionID) ? state.auctions.items.get(state.auctionID).toJS() : null,
    auctions: state.auctions,
    contract: state.contracts.items.get(state.contractID) ? state.contracts.items.get(state.contractID).toJS() : null,
    contracts: state.contracts,
    fetchingTickets: state.tickets.isFetching,
    modal: state.modal,
    roles: state.roles,
    ticket: state.tickets.items.get(state.ticketID) ? state.tickets.items.get(state.ticketID).toJS() : null,
    tickets: state.tickets,
});
let mapActionsToProps = dispatch => ({
    userActions: bindActionCreators(UserActions, dispatch),
    ticketActions: bindActionCreators(TicketActions, dispatch),
    auctionActions: bindActionCreators(AuctionActions, dispatch),
    contractActions: bindActionCreators(ContractActions, dispatch),
});
export default connect(mapStateToProps, mapActionsToProps)(ModalView);
