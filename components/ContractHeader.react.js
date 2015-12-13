import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import { DISCUSSION, WAITING_FOR_DEV, WAITING_FOR_CLIENT } from '../constants/MediationStates';
import { getContractWork, getContractTicket } from '../utils/getters';

export default class ContractHeader extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
        contract: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        toggleDetails: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
    }

    render() {
        const { contract } = this.props;
        const ticket = getContractTicket(contract);
        return (
            <div className='infoHeader'>
                <div className='mainInfo'>
                    <span className='title'>{ticket.title}</span>
                    <Status contract={contract} />
                </div>
                <div className='otherInfo'>
                </div>
            </div>
        )
    }
}

export class Status extends Component {
    render() {
        return (
            <div className='status'>
                <svg height='12px' width='12px' viewBox='0 0 12 12'>
                    <circle cx='6' cy='6' r='6' fill='orange'/>
                </svg>
                <span>{'Some status that I will deal with later'}</span>
            </div>
        );
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
        const ticket = getContractTicket(contract);
        return (
            <TicketHeader title={ticket.title} unselect={unselect} toggleDetails={toggleDetails}>
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
        const ticket = getContractTicket(contract);
        return (
            <TicketHeader title={ticket.title} unselect={unselect} toggleDetails={toggleDetails}>
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
        const ticket = getContractTicket(contract);
        return (
            <TicketHeader title={ticket.title} unselect={unselect} toggleDetails={toggleDetails}>
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
        const work = getContractWork(contract);
        const mediation = work.mediations[work.mediations.length-1];
        const ticket = getContractTicket(contract);
        let waitingForResponse = (mediation.state == DISCUSSION);
        waitingForResponse = waitingForResponse || (role.type == 'contractor' && mediation.state == WAITING_FOR_DEV);
        waitingForResponse = waitingForResponse || (role.type == 'manager' && mediation.state == WAITING_FOR_CLIENT);
        return (
            <TicketHeader title={ticket.title} unselect={unselect} toggleDetails={toggleDetails}>
                { waitingForResponse ? <button onClick={actions.openResolveMediationModal} key='resolveMediation'>Resolve Issue</button> : null }
            </TicketHeader>
        );
    }
}

