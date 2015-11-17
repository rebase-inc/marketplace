import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';
import CodePanel from './CodePanel.react';
import OfferPanel from './OfferPanel.react';
import TicketPanel from './TicketPanel.react';

class ReviewDetails extends Component {
    static propTypes = {
        review: PropTypes.object.isRequired,
        hidden: PropTypes.bool.isRequired,
    }
    render() {
        const { review, hidden } = this.props;
        return (
            <div className={hidden ? 'hidden' : 'visible'} id='itemDetails'>
                <TicketPanel ticket={review.ticket} />
                <OfferPanel offer={review.work.offer} />
                <CodePanel
                    clone={review.work.clone}
                    deploy={review.ticket.project.deploy}
                    test={review.ticket.project.test}
                    readme={review.ticket.project.readme}
                />
            </div>
        );
    }
};

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
        const { user, roles, review, unselect, submitComment } = this.props;
        console.log('Review:', review);
        return (
            <div className='contentView'>
                <TicketHeader title={review.ticket.title} unselect={unselect} toggleDetails={this.toggleDetails} />
                <ReviewDetails hidden={!this.state.detailsOpen} review={review} />
                <CommentList comments={review.ticket.comments}/>
                <CommentBox submit={submitComment} />
            </div>
        );
    }
};
