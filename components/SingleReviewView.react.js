import React, { Component, PropTypes } from 'react';

import TicketHeader from './TicketHeader.react';
import CommentList from './CommentList.react';
import CommentBox from './CommentBox.react';
import DetailsPanel from './DetailsPanel.react';
import ReviewStatusHeader from './ReviewStatusHeader.react';

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
        let contractor = review.work.offer.contractor;
        return (
            <div className='contentView'>
                <TicketHeader title={review.ticket.title} unselect={unselect} toggleDetails={this.toggleDetails} />
                <ReviewStatusHeader review={review} role={roles.items.get(user.current_role.id)}/>
                <DetailsPanel
                    hidden={!this.state.detailsOpen}
                    ticket={review.ticket}
                    clone={review.work.clone}
                    >
                    <span>{'Assigned to ' + contractor.user.name}</span>
                </DetailsPanel>
                <CommentList comments={review.all_comments}/>
                <CommentBox submit={submitComment} />
            </div>
        );
    }
};
