import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import AuctionHeader from './AuctionHeader.react';
import Comment from './Comment.react';
import CommentBox from './CommentBox.react';
import TalentView from './TalentView.react';
import { humanReadableDate } from '../utils/date';
import { getAuctionTicket } from '../utils/getters';

export default class SingleAuctionView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
        auction: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
    }

    render() {
        const { user, role, auction, actions } = this.props;
        const ticket = getAuctionTicket(auction);
        return (
            <div className='singleView'>
                <AuctionHeader role={role} auction={auction} openBidModal={actions.openBidModal} makeNotification={actions.makeNotification} />
                <div className='content'>
                    <div className='scrollable'>
                        { ticket.comments.map( comment => <Comment comment={comment} key={comment.id} /> ) }
                        <CommentBox submit={actions.commentOnAuction.bind(null, user, auction)}/>
                    </div>
                    { role.type == 'manager' ? <TalentView nominations={auction.ticket_set.nominations} auction={auction} approve={actions.approveNomination} /> : null }
                </div>
            </div>
        );
    }
};
