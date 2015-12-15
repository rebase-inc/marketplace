import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import CodeField from './CodeField.react';
import ContractStatus from './ContractStatus.react';
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
                <div className='mainInfo'>
                    <span className='title'>{ticket.title}</span>
                    <ContractStatus contract={contract} role={role} />
                </div>
                <div className='otherInfo'>
                    <CodeField name='Clone (ssh)' value={work.clone} />
                    <CodeField name='Deploy' value={ticket.project.deploy} />
                </div>
            </div>
        )
    }
}
