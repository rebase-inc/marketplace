import React, { Component, PropTypes } from 'react';
import keymirror from 'keymirror'

import HaltWorkModal from './HaltWorkModal.react';
import ResumeWorkModal from './ResumeWorkModal.react';
import SubmitWorkModal from './SubmitWorkModal.react';
import AcceptWorkModal from './AcceptWorkModal.react';
import DisputeWorkModal from './DisputeWorkModal.react';
import ResolveMediationModal from './ResolveMediationModal.react';

import TicketHeader from './TicketHeader.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';
import OfferPanel from './OfferPanel.react';
import AuctionPanel from './AuctionPanel.react';
import DetailsPanel from './DetailsPanel.react';

const ModalTypes = keymirror({
    HALT_WORK: null,
    SUBMIT_WORK: null,
    UNBLOCK_WORK: null,
    RESOLVE_MEDIATION: null,
    ACCEPT_WORK: null,
    DISPUTE_WORK: null,
});

class ContractDetails extends Component {
    static propTypes = {
        contract: PropTypes.object.isRequired,
        hidden: PropTypes.bool.isRequired,
    }
    render() {
        const { contract, hidden } = this.props;
        return (
            <DetailsPanel
                hidden={hidden}
                ticket={contract.ticket}
                clone={contract.work.clone}
                >
                <OfferPanel offer={contract.bid.work_offers[0]} />
                <AuctionPanel auction={contract.bid.auction} />
            </DetailsPanel>
        );
    }
};

export default class SingleContractView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        contract: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        submitWork: PropTypes.func.isRequired,
        disputeWork: PropTypes.func.isRequired,
        acceptWork: PropTypes.func.isRequired,
        markWorkBlocked: PropTypes.func.isRequired,
        markWorkUnblocked: PropTypes.func.isRequired,
    }
    render() {
        const { role } = this.props;
        switch (role.type) {
            case 'contractor': return <ContractContractorView {...this.props} />; break;
            case 'manager' : return <ContractManagerView {...this.props} />; break;
        }
    }
}

export class ContractContractorView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        contract: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        submitWork: PropTypes.func.isRequired,
        markWorkBlocked: PropTypes.func.isRequired,
        markWorkUnblocked: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { modalType: null, detailsOpen: false };
        this._makeHeaderButtons = this._makeHeaderButtons.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
    }

    toggleDetails(newState) {
        if (typeof(newState) == 'boolean') {
            this.setState({ detailsOpen: newState });
        } else {
            this.setState({ detailsOpen: !this.state.detailsOpen });
        }
    }

    _makeHeaderButtons(contract) {
        switch(contract.work.state) {
            case 'in_progress':
                return ([
                    <button onClick={() => this.setState({ modalType: ModalTypes.SUBMIT_WORK })} key='finished'>Finished</button>,
                    <button onClick={() => this.setState({ modalType: ModalTypes.HALT_WORK })} key='blocked'>Blocked</button>
                ]);
                break;
            case 'in_review': return null; break;
            case 'blocked':
                return <button onClick={() => this.setState({ modalType: ModalTypes.UNBLOCK_WORK})} key='unblock'>Unblock</button>;
                break;
            case 'in_mediation':
                const mediation = contract.work.mediations[contract.work.mediations.length - 1];
                if ( mediation.state == 'discussion' || mediation.state == 'waiting_for_dev' ) {
                    return <button onClick={() => this.setState({ modalType: ModalTypes.RESOLVE_MEDIATION})} key='resolveIssue'>Resolve Issue</button>;
                } else { return null; }
                break;
            default: return null; break;
        }
    }

    render() {
        const { submitWork, markWorkBlocked, markWorkUnblocked, contract, unselect, ...props } = this.props;
        const closeModal = () => this.setState({ modalType: null });
        return (
            <div className='contentView'>
                {
                    () => {
                        switch(this.state.modalType) {
                            case ModalTypes.SUBMIT_WORK: return <SubmitWorkModal close={closeModal} submitWork={submitWork} />; break;
                            case ModalTypes.HALT_WORK: return <HaltWorkModal close={closeModal} markWorkBlocked={markWorkBlocked} />; break;
                            case ModalTypes.UNBLOCK_WORK: return <ResumeWorkModal close={closeModal} markWorkUnblocked={markWorkUnblocked} />; break;
                            case ModalTypes.RESOLVE_MEDIATION: return <ResolveMediationModal close={closeModal} resolveMediation={() => alert('oops')} />; break;
                            default: return null; break;
                        }
                    }()
                }
                <TicketHeader title={contract.ticket.title} unselect={unselect} toggleDetails={this.toggleDetails}>
                    { this._makeHeaderButtons(contract) }
                </TicketHeader>
                <ContractDetails hidden={!this.state.detailsOpen} contract={contract} />
                <CommentList comments={contract.ticket.comments}/>
                <CommentBox submit={() => alert.bind(null, 'oops')}/>
            </div>
        );
    }
}

export class ContractManagerView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        contract: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        acceptWork: PropTypes.func.isRequired,
        disputeWork: PropTypes.func.isRequired,
        markWorkUnblocked: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { modalType: null, detailsOpen: false };
        this._makeHeaderButtons = this._makeHeaderButtons.bind(this);
        this.toggleDetails = this.toggleDetails.bind(this);
    }

    toggleDetails(newState) {
        if (typeof(newState) == 'boolean') {
            this.setState({ detailsOpen: newState });
        } else {
            this.setState({ detailsOpen: !this.state.detailsOpen });
        }
    }

    _makeHeaderButtons(contract) {
        switch(contract.work.state) {
            case 'in_progress': return null; break;
            case 'in_review':
                return ([
                    <button onClick={() => this.setState({ modalType: ModalTypes.ACCEPT_WORK })} key='acceptWork'>Accept Work</button>,
                    <button onClick={() => this.setState({ modalType: ModalTypes.DISPUTE_WORK })} className='needsResolution' key='dispute'>Dispute</button>
                ]);
                break;
            case 'blocked':
                return <button onClick={() => this.setState({ modalType: ModalTypes.UNBLOCK_WORK})} key='unblock'>Unblock</button>;
                break;
            case 'in_mediation':
                const mediation = contract.work.mediations[contract.work.mediations.length - 1];
                if ( mediation.state == 'discussion' || mediation.state == 'waiting_for_client' ) {
                    return <button onClick={() => this.setState({ modalType: ModalTypes.RESOLVE_MEDIATION})} key='resolveIssue'>Resolve Issue</button>;
                } else { return null; }
                break;
            default: return null; break;
        }
    }

    render() {
        const { acceptWork, disputeWork, markWorkUnblocked, contract, unselect, ...props } = this.props;
        const closeModal = () => this.setState({ modalType: null });
        return (
            <div className='contentView'>
                {
                    () => {
                        switch(this.state.modalType) {
                            case ModalTypes.ACCEPT_WORK: return <AcceptWorkModal close={closeModal} acceptWork={acceptWork} />; break;
                            case ModalTypes.DISPUTE_WORK: return <DisputeWorkModal close={closeModal} disputeWork={disputeWork} />; break;
                            case ModalTypes.UNBLOCK_WORK: return <ResumeWorkModal close={closeModal} markWorkUnblocked={markWorkUnblocked} />; break;
                            case ModalTypes.RESOLVE_MEDIATION: return <ResolveMediationModal close={closeModal} resolveMediation={() => alert('oops')} />; break;
                            default: return null; break;
                        }
                    }()
                }
                <TicketHeader title={contract.ticket.title} unselect={unselect} toggleDetails={this.toggleDetails}>
                    { this._makeHeaderButtons(contract) }
                </TicketHeader>
                <ContractDetails hidden={!this.state.detailsOpen} contract={contract} />
                <CommentList comments={contract.ticket.comments}/>
                <CommentBox submit={() => alert.bind(null, 'oops')}/>
            </div>
        );
    }
}

