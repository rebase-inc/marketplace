import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import TicketDetails from './TicketDetails.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';

export default class SingleAuctionView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        auction: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { modalOpen: false, detailsOpen: false }
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
        const { user, roles, auction, unselect } = this.props;
        console.log('single auction view auction is ', auction);
        // TODO: refactor this so that TicketHeader and TicketDetails are in the same component. Current setup doesn't make sense.
        // That would also allow for a more sensical method for closing and opening the TicketDetails
        return (
            <div className='ticketView'>
                <TicketHeader unselect={unselect} title={auction.ticket.title} toggleDetails={this.toggleDetails}>
                    { roles.items.get(user.current_role.id).type == 'manager' ? <button>View Talent</button> : <button>Bid Now</button> }
                </TicketHeader>
                <TicketDetails hidden={!this.state.detailsOpen} ticket={auction.ticket} />
                <CommentList comments={auction.ticket.comments}/>
                <CommentBox submit={alert} />
            </div>
        );
    }
};
