import React, { Component, PropTypes } from 'react';

import { humanReadableDate } from '../utils/date';

export default class ContractStatusHeader extends Component {
    static propTypes = {
        contract: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
    }

    render() {
        const { contract, role } = this.props;
        let statusText = '';
        switch (contract.work.state) {
            case 'in_progress':
                statusText += 'Being worked on by ';
                statusText += role.type == 'manager' ? contract.bid.contractor.user.name : 'you';;
                statusText += '. ';
                statusText += 'To be finished by ';
                statusText += humanReadableDate(contract.bid.auction.finish_work_by);
                statusText += '.';
                break;
            case 'in_review':
                statusText += 'Being reviewed by ';
                statusText += contract.ticket.project.organization.name;
                statusText += role.type == 'manager' ? ' (you)' : '';
                statusText += '. ';
                statusText += 'To be accepted by ';
                // this is not actually the correct day by which it needs to be accepted.
                statusText += humanReadableDate(contract.bid.auction.finish_work_by);
                statusText += '.';
                break;
            case 'blocked':
                statusText += 'Marked as blocked by ';
                statusText += contract.bid.contractor.user.name;
                statusText += role.type == 'contractor' ? ' (you)' : '';
                statusText += '. ';
                statusText += 'Waiting to be unblocked by ';
                statusText += contract.ticket.project.organization.name;
                statusText += role.type == 'manager' ? ' (you)' : '';
                statusText += '.';
                break;
            case 'in_mediation':
                const mediation = contract.work.mediations[contract.work.mediations.length - 1];
                statusText += 'There is disagreement about the state of this work. Waiting for response from ';
                statusText += mediation.state == 'discussion' ? 'both parties.' : '';
                statusText += mediation.state == 'waiting_for_dev' ? contract.bid.contractor.user.name : '';
                statusText += mediation.state == 'waiting_for_client' ? contract.ticket.project.organization.name : '';
                statusText += '.';
                break;
        }
        return (
            <div id='statusHeader'
                data-neutral={undefined}
                data-notification={contract.work.state == 'in_progress' || undefined}
                data-okay={contract.work.state == 'in_review' || undefined}
                data-alert={contract.work.state == 'blocked' || contract.work.state == 'in_mediation' || undefined}
                data-warning={undefined} >
                { statusText }
            </div>
        );
    }
}
