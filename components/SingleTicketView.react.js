import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import TicketHeader from './TicketHeader.react';
import Comment from './Comment.react';
import CommentBox from './CommentBox.react';
import CreateAuctionModal from './CreateAuctionModal.react';

export default class SingleTicketView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        ticket: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { detailsOpen: false }
    }

    render() {
        const { ticket, actions, role, user } = this.props;
        if (!ticket) { return <div className='singleView'> { 'No Ticket Selected' } </div>; }
        return (
            <div className='singleView'>
                <TicketHeader openNewAuctionModal={actions.openNewAuctionModal} ticket={ticket} role={role} />
                <div className='content'>
                    <div className='scrollable'>
                        { ticket.comments.map( comment => <Comment comment={comment} key={comment.id} /> ) }
                        <CommentBox submit={actions.commentOnTicket.bind(null, user, ticket)}/>
                    </div>
                </div>
            </div>
        );
    }
};
