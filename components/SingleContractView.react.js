import React, { Component, PropTypes } from 'react';

import ContractHeader from './ContractHeader.react';
import ContractStatusHeader from './ContractStatusHeader.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';
import DetailsPanel from './DetailsPanel.react';
import { humanReadableDate } from '../utils/date';
import { getContractTicket, getContractWork, getContractComments } from '../utils/getters';

export default class SingleContractView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        contract: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { detailsOpen: false };
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
        const { contract, user, role, actions } = this.props;
        const ticket = getContractTicket(contract);
        const work = getContractWork(contract);
        console.log('comments are ', getContractComments(contract));
        return (
            <div className='contentView'>
                <ContractHeader actions={actions} contract={contract} role={role} unselect={actions.selectContract.bind(null, null)} toggleDetails={this.toggleDetails} />
                <ContractStatusHeader contract={contract} role={role} />
                <DetailsPanel hidden={!this.state.detailsOpen} ticket={ticket} clone={work.clone}>
                    <span>{'Assigned to ' + contract.bid.contractor.user.name}</span>
                </DetailsPanel>
                <CommentList comments={getContractComments(contract)}/>
                <CommentBox submit={actions.commentOnContract.bind(null, user, contract)}/>
            </div>
        );
    }
}
