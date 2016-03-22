import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import AuctionHeader from './AuctionHeader.react';
import Comment from './Comment.react';
import CommentBox from './CommentBox.react';
import NominationView from './NominationView.react';
import { humanReadableDate } from '../utils/date';
import { getAuctionTicket } from '../utils/getters';

export default class SingleAuctionView extends Component {
    static propTypes = {
        actions:    PropTypes.object.isRequired,
        auction:    PropTypes.object.isRequired,
        role:       PropTypes.object.isRequired,
        user:       PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { user, role, auction, actions } = this.props;
        if (!auction) { return <div className='singleView'> { 'No Auction Selected' } </div>; }
        return (
            <div className='singleView'>
                <AuctionHeader role={role} auction={auction} openBidModal={actions.openBidModal} makeNotification={actions.makeNotification} />
                <div className='content'>
                    <div className='scrollable'>
                        { getAuctionTicket(auction).comments.map( comment => <Comment comment={comment} key={comment.id} /> ) }
                        <CommentBox submit={actions.commentOnAuction.bind(null, user, auction)}/>
                    </div>
                    { role.type == 'manager' ? <NominationView auction={auction} {...actions} /> : null }
                    { role.type == 'developer' ? null : null }
                </div>
            </div>
        );
    }
};
