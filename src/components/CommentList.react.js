// External
var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

// Actions
var CommentActions = require('../actions/CommentActions');

// Utils
var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var CommentList = React.createClass({
    handleScrollPosition: function() {
        handleScrollShadows(this);
    },
    componentWillUnmount: function() {
        this.getDOMNode().removeEventListener('scroll', this.handleScrollPosition, false);
    },
    componentWillUpdate: function() {
        var node = this.getDOMNode();
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
    },
    componentWillUnmount: function() {
    },
    componentDidUpdate: function() {
        if (this.shouldScrollBottom) {
            var node = this.getDOMNode();
            node.scrollTop = node.scrollHeight
        }
        this.handleScrollPosition();
    },
    componentDidMount: function() {
        var node = this.getDOMNode();
        node.scrollTop = node.scrollHeight
        this.handleScrollPosition();
        this.getDOMNode().addEventListener('scroll', this.handleScrollPosition, false);
        this.props.comments.map(CommentActions.getCommentDetail);
    },
    render: function() {
        var all_comments = [];
        this.props.comments.forEach(function(comment) {
            all_comments.push(
                <div className='comment' key={comment.id}>
                    <div className='photo'>
                        <img src={!!comment.user ? comment.user.photo : 'img/placeholder-user-60px.png'}/>
                    </div>
                    <div className='content'>
                        <div className='name'>{!!comment.user ? comment.user.first_name + ' ' + comment.user.last_name : 'Unknown User'}</div>
                        <div className='date'>{comment.date}</div>
                        <div className='text'>{comment.content}</div>
                    </div>
                </div>
            );
        });
        return (
                <ReactCSSTransitionGroup component='div' style={this.props.style} id='commentList' transitionName='newComment'>
                {all_comments}
                </ReactCSSTransitionGroup>
               );
    }
});

module.exports = CommentList;
