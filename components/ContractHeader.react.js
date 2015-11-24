import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import { DISCUSSION, WAITING_FOR_DEV, WAITING_FOR_CLIENT } from '../constants/MediationStates';

export default class ContractHeader extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
        contract: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        toggleDetails: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
    }
    
    render() {
        const { role, contract, unselect, toggleDetails, actions } = this.props;
        console.log('contract work state is ', contract.work.state);
        switch (contract.work.state) {
            case 'in_progress': return <InProgressContractHeader contract={contract} actions={actions} role={role} unselect={unselect} toggleDetails={toggleDetails} />;
            case 'in_review': return <InReviewContractHeader contract={contract} actions={actions} role={role} unselect={unselect} toggleDetails={toggleDetails} />;
            case 'blocked': return <BlockedContractHeader contract={contract} actions={actions} role={role} unselect={unselect} toggleDetails={toggleDetails} />;
            case 'in_mediation': return <InMediationContractHeader contract={contract} actions={actions} role={role} unselect={unselect} toggleDetails={toggleDetails} />;
            default: console.warn('Invalid work state: ', contract.work.state); break;
        }
    }
}

export class InProgressContractHeader extends Component {
    static propTypes = {
        contract: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        toggleDetails: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
    }

    render() {
        const { role, contract, unselect, toggleDetails, actions } = this.props;
        return (
            <TicketHeader okay title={contract.ticket.title} unselect={unselect} toggleDetails={toggleDetails}>
                { role.type == 'contractor' ? <button onClick={actions.openSubmitWorkModal} key='finished'>Finished</button> : null }
                { role.type == 'contractor' ? <button data-alert onClick={actions.openBlockWorkModal} key='blocked'>Blocked</button>: null }
            </TicketHeader>
        );
    }
}

export class InReviewContractHeader extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
        contract: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        toggleDetails: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
    }

    render() {
        const { role, contract, unselect, toggleDetails, actions } = this.props;
        return (
            <TicketHeader okay title={contract.ticket.title} unselect={unselect} toggleDetails={toggleDetails}>
                { role.type == 'manager' ? <button data-okay onClick={actions.openAcceptWorkModal} key='acceptWork'>Accept Work</button> : null }
                { role.type == 'manager' ? <button data-warning onClick={actions.openDisputeWorkModal} data-alert key='dispute'>Dispute</button> : null }
            </TicketHeader>
        );
    }
}

export class BlockedContractHeader extends Component {
    static propTypes = {
        contract: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        toggleDetails: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
    }

    render() {
        const { contract, unselect, toggleDetails, actions } = this.props;
        return (
            <TicketHeader alert title={contract.ticket.title} unselect={unselect} toggleDetails={this.toggleDetails}>
                <button data-alert onClick={actions.openUnblockWorkModal} key='unblockWork'>Unblock</button>
            </TicketHeader>
        );
    }
}

export class InMediationContractHeader extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
        contract: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        toggleDetails: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
    }

    render() {
        const { contract, unselect, role, toggleDetails, actions } = this.props;
        const mediation = contract.work.mediation[0];
        let waitingForResponse = (mediation.state == DISCUSSION);
        waitingForResponse = waitingForResponse || (role.type == 'contractor' && mediation.state == WAITING_FOR_DEV);
        waitingForResponse = waitingForResponse || (role.type == 'manager' && mediation.state == WAITING_FOR_CLIENT);
        return (
            <TicketHeader alert title={contract.ticket.title} unselect={unselect} toggleDetails={toggleDetails}>
                { waitingForResponse ? <button onClick={actions.openResolveMediationModal} key='resolveMediation'>Resolve Issue</button> : null }
            </TicketHeader>
        );
    }
}

