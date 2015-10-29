import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import TicketDetails from './TicketDetails.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';
import FindTalentView from './FindTalentView.react';
import BidModal from './BidModal.react';

export default class SingleAuctionView extends Component {
    static propTypes = {
        bid: PropTypes.func.isRequired,
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        auction: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { modalOpen: false, detailsOpen: false, showTalent: props.roles.items.get(props.user.current_role.id).type == 'manager' }
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
        const { user, roles, auction, unselect, approveNomination, bid } = this.props;

        // TODO: refactor this so that TicketHeader and TicketDetails are in the same component. Current setup doesn't make sense.
        // That would also allow for a more sensical method for closing and opening the TicketDetails
        // TODO: Deal with all of the states below more cleanly. Probably requires a refactor into multiple components
        // TODO: Only display 'View Talent' button when not showing the FindTalentView
        // TODO: Build components ontop of TicketHeader like AuctionHeader, ContractHeader, etc (and probably rename TicketHeader -> ContentHeader)
        return (
            <div className='ticketView'>
                { this.state.modalOpen ? <BidModal auction={auction} bid={bid} close={() => this.setState({ modalOpen: false})}/> : null }
                <TicketHeader
                    title={auction.ticket.title}
                    unselect={this.state.showTalent ? () => this.setState({ showTalent: false }) : unselect}
                    toggleDetails={this.toggleDetails}>
                    { roles.items.get(user.current_role.id).type == 'manager' ?
                        <button onClick={() => this.setState({ showTalent: true })}>View Talent</button> :
                        <button onClick={() => this.setState({ modalOpen: true })}>Bid Now</button> }
                </TicketHeader>
                <TicketDetails hidden={!this.state.detailsOpen} ticket={auction.ticket} />
                { this.state.showTalent ? <FindTalentView auction={auction} approveNomination={approveNomination} /> : null }
                { this.state.showTalent ? null : <CommentList comments={auction.ticket.comments}/> }
                { this.state.showTalent ? null : <CommentBox submit={alert} /> }
            </div>
        );
    }
};
