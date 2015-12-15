import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import Comment from './Comment.react';
import CommentBox from './CommentBox.react';
import DetailsPanel from './DetailsPanel.react';
import ReviewHeader from './ReviewHeader.react';
import { getReviewTicket, getReviewComments } from '../utils/getters';

export default class SingleReviewView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        roles: PropTypes.object.isRequired,
        unselect: PropTypes.func.isRequired,
        review: PropTypes.object.isRequired,
        submitComment: PropTypes.func.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.state = { detailsOpen: false }
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
        const { user, role, review, actions, unselect, submitComment } = this.props;
        const contractor = review.work.offer.contractor;
        const ticket = review.work.offer.ticket_snapshot.ticket;
        return (
            <div className='singleView'>
                <ReviewHeader review={review} role={role} />
                { getReviewComments(review).map( comment => <Comment comment={comment} key={comment.id} /> ) }
                <CommentBox submit={actions.commentOnReview.bind(null, user, ticket)}/>
            </div>
        );
    }
};
