import React, { Component, PropTypes } from 'react';

import ContractHeader from './ContractHeader.react';
import ContractStatusHeader from './ContractStatusHeader.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';
import DetailsPanel from './DetailsPanel.react';
import { humanReadableDate } from '../utils/date';

export default class SingleContractView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        contract: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { modalType: null, detailsOpen: false };
        this.toggleDetails = this.toggleDetails.bind(this);
    }

    toggleDetails(newState) {
        if (typeof(newState) == 'boolean') {
            this.setState({ detailsOpen: newState });
        } else {
            this.setState({ detailsOpen: !this.state.detailsOpen });
        }
    }

    render() {
        const { contract, user, role, unselect, actions } = this.props;
        return (
            <div className='contentView'>
                <ContractHeader actions={actions} contract={contract} role={role} unselect={unselect} toggleDetails={this.toggleDetails} />
                <ContractStatusHeader contract={contract} role={role} />
                <DetailsPanel
                    hidden={!this.state.detailsOpen}
                    ticket={contract.ticket}
                    clone={contract.work.clone}>
                    <span>{'Assigned to ' + contract.bid.contractor.user.name}</span>
                </DetailsPanel>
                <CommentList comments={contract.ticket.comments}/>
                <CommentBox submit={() => alert.bind(null, 'oops')}/>
            </div>
        );
    }
}
