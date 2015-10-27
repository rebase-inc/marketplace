import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Comment from './Comment.react';

export default class CommentList extends Component {
    static propTypes = {
       comments: PropTypes.array.isRequired,
    }
    render() {
        const { comments } = this.props;
        return (
                <ReactCSSTransitionGroup component='div' transitionLeaveTimeout={300} id='commentList' transitionName='newComment'>
                    { comments.map( comment => <Comment comment={comment} /> ) }
                </ReactCSSTransitionGroup>
           );
    }
};
