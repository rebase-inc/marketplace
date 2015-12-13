import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import Comment from './Comment.react';
import CommentBox from './CommentBox.react';

export default class CommentList extends Component {
    static propTypes = {
       comments: PropTypes.array.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }

    componentWillUpdate() {
        const node = ReactDOM.findDOMNode(this);
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
    }
    componentDidUpdate() {
        const node = ReactDOM.findDOMNode(this);
        if (this.shouldScrollBottom) {
            node.scrollTop = node.scrollHeight
        }
    }

    componentDidMount() {
        const node = ReactDOM.findDOMNode(this);
        node.scrollTop = node.scrollHeight;
    }

    render() {
        const { comments, submit } = this.props;
        return (
                <div id='commentList'>
                    { comments.map( comment => <Comment comment={comment} key={comment.id} /> ) }
                    <CommentBox submit={submit} />
                </div>
           );
    }
};
