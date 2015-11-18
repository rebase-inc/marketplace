import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';
import CreateAuctionModal from './CreateAuctionModal.react';
import DetailsPanel from './DetailsPanel.react';


export default class SingleTicketView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        ticket: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        submitComment: PropTypes.func.isRequired,
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
        const { user, roles, ticket, unselect, createAuction, submitComment } = this.props;
        // TODO: refactor this so that TicketHeader and TicketDetails are in the same component. Current setup doesn't make sense.
        // That would also allow for a more sensical method for closing and opening the TicketDetails
        return (
            <div className='contentView'>
                { this.state.modalOpen ? <CreateAuctionModal isLoading={ticket.isFetching} close={() => this.setState({ modalOpen: false })} create={createAuction}/> : null }
                <TicketHeader unselect={unselect} title={ticket.title} toggleDetails={this.toggleDetails}>
                    { roles.items.get(user.current_role.id).type == 'manager' ? <button onClick={() => this.setState({ modalOpen: true })}>Find Developers</button> : null}
                </TicketHeader>
                <DetailsPanel
                    hidden={!this.state.detailsOpen}
                    ticket={ticket}
                    clone={ticket.project.work_repo.clone}
                />
                <CommentList comments={ticket.comments}/>
                <CommentBox submit={submitComment} />
            </div>
        );
    }
};
