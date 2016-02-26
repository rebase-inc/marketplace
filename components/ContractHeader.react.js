import React, { Component, PropTypes } from 'react';

import ContractStatus from './ContractStatus.react';
import TicketTimeline from './TicketTimeline.react';
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
        const { contract, role } = this.props;
        const ticket = getContractTicket(contract);
        const work = getContractWork(contract);
        return (
            <div className='infoHeader'>
                <div className='tool'>
                </div>
                <div className='mainInfo'>
                    <span className='title'>{ticket.title}</span>
                </div>
                <div className='tool'>
                </div>
            </div>
        )
    }
}
