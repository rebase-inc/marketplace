// External
var React = require('react');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

//Components
var ProfilePicture = require('../components/Icons.react').ProfilePicture;

// Actions
var CommentActions = require('../actions/CommentActions');

// Utils
var handleScrollShadows = require('../utils/Style').handleScrollShadows;

var CommentList = React.createClass({
    handleScrollPosition: function() {
        handleScrollShadows(this);
    },
    componentWillUnmount: function() {
        ReactDOM.findDOMNode(this).removeEventListener('scroll', this.handleScrollPosition, false);
    },
    componentWillUpdate: function() {
        var node = ReactDOM.findDOMNode(this); 
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
    },
    componentDidUpdate: function() {
        if (this.shouldScrollBottom) {
            var node = ReactDOM.findDOMNode(this); 
            node.scrollTop = node.scrollHeight
        }
        this.handleScrollPosition();
    },
    componentDidMount: function() {
        var node = ReactDOM.findDOMNode(this); 
        node.scrollTop = node.scrollHeight
        this.handleScrollPosition();
        node.addEventListener('scroll', this.handleScrollPosition, false);
        this.props.comments.map(el => setTimeout(CommentActions.getCommentDetail.bind(null, el), 0));
    },
    render: function() {
        var all_comments = [];
        this.props.comments.forEach(function(comment) {
            all_comments.push(
                <div className='comment' key={comment.id}>
                    <div className='photo'>
                        <ProfilePicture user={comment.user || {first_name: 'A', last_name: 'M'}}/>    
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
                <ReactCSSTransitionGroup component='div' id='commentList' transitionName='newComment'>
                {all_comments}
                </ReactCSSTransitionGroup>
               );
    }
});

module.exports = CommentList;
