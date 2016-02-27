import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Comment from './Comment.react';
import CommentBox from './CommentBox.react';
import ReviewHeader from './ReviewHeader.react';
import { getReviewTicket, getReviewComments } from '../utils/getters';

export default class SingleReviewView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        review: PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
    }
    
    componentDidUpdate(prevProps) {
        if (this.props.review.id != prevProps.review.id) {
            const node = ReactDOM.findDOMNode(this);
            node.scrollTop = 0;
        }
    }

    render() {
        const { user, role, review, actions } = this.props;
        if (!review) { return <div className='singleView'> { 'No Review Selected' } </div>; }
        return (
            <div className='singleView'>
                <ReviewHeader review={review} role={role} />
                <div className='content'>
                    <div className='scrollable'>
                        { getReviewComments(review).map( comment => <Comment comment={comment} key={comment.id} /> ) }
                        <CommentBox submit={actions.commentOnReview.bind(null, user, review)}/>
                    </div>
                </div>
            </div>
        );
    }
};
