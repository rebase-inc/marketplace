import React, { Component, PropTypes } from 'react';

import ContractHeader from './ContractHeader.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';
import OfferPanel from './OfferPanel.react';
import AuctionPanel from './AuctionPanel.react';
import DetailsPanel from './DetailsPanel.react';

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
                <ContractDetails hidden={!this.state.detailsOpen} contract={contract} />
                <CommentList comments={contract.ticket.comments}/>
                <CommentBox submit={() => alert.bind(null, 'oops')}/>
            </div>
        );
    }
}
