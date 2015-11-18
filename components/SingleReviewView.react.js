import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';
import DetailsPanel from './DetailsPanel.react';
import OfferPanel from './OfferPanel.react';
import TicketPanel from './TicketPanel.react';

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
                <DetailsPanel
                    hidden={!this.state.detailsOpen}
                    clone={review.work.clone}
                    deploy={review.ticket.project.deploy}
                    test={review.ticket.project.test}
                    readme={review.ticket.project.readme}
                    >
                    <TicketPanel ticket={review.ticket} />
                    <OfferPanel offer={review.work.offer} />
                </DetailsPanel>
                <CommentList comments={review.ticket.comments}/>
                <CommentBox submit={submitComment} />
            </div>
        );
    }
};
