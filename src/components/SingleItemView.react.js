var React = require('react/addons');
var TicketStore = require('../stores/TicketStore');

var RebaseActions = require('../actions/RebaseActions');
var Icons = require('../components/RebaseIcons.react');
var handleScrollShadows = require('../utils/Graphics').handleScrollShadows;

var SingleItemView = React.createClass({
    getInitialState: function() {
        return { view: 'viewingComments' }
    },

    render: function() {
        var title;
        var comments;
        var { ticket, auction, ...other} = this.props;
        if (!ticket == !auction) { throw "Must provide exactly one of ticket or auction!" }
        else if (!!ticket) {
            title = ticket.title;
            comments = this.props.ticket.comments;
        }
        else if (!!auction) {
            title = auction.ticket_set.bid_limits[0].ticket_snapshot.ticket.title;
            comments = this.props.auction.ticket_set.bid_limits[0].ticket_snapshot.ticket.comments;
        }
        else { title = '...'; }
        return (
            <div id='singleItemView' className='mainContent'>
                <div id='singleItem'>
                    <ItemHeader title={title} ticket={ticket} auction={auction} {...this.props} />
                    <CommentList comments={comments}/>
                    <CommentBox ticket={ticket} auction={auction} user={this.props.user} />
                </div>
            </div>
        );
    }
});

var CommentBox = React.createClass({
    getInitialState: function() {
        return {
            inProgress: false,
            commentText: '',
        }
    },

    startComment: function() {
        this.setState({inProgress: true});
    },

    exitComment: function() {
        this.setState({inProgress: false});
    },
    cancelComment: function() {
        this.setState({
            inProgress: false,
            commentText: ''
        });
    },
    submitComment: function() {
        if (!!this.props.ticket) {
            RebaseActions.commentOnTicket(this.props.user, this.props.ticket, this.state.commentText);
        }
        else if (!!this.props.auction) {
            RebaseActions.commentOnAuction(this.props.user, this.props.auction, this.state.commentText);
        }
        this.cancelComment();
    },

    handleInput: function() {
        this.setState({ commentText: this.refs.commentText.getDOMNode().value });
    },

    render: function() {
        var buttons;
        var className;
        if (this.state.inProgress || !!this.state.commentText) {
            buttons = (
                <div id='commentSubmissionButtons'>
                <button onClick={this.submitComment}>Comment</button>
                <button onClick={this.cancelComment}>Cancel</button>
                </div>
            );
            className = 'inProgress';
        }
        return (
            <div id='newCommentBox' className={className}>
            <textarea value={this.state.commentText} ref='commentText' onFocus={this.startComment} onBlur={this.exitComment} onChange={this.handleInput} type='text' placeholder='Leave a comment' />
            { buttons }
            </div>
        );
    }
});

var TicketInfo = React.createClass({
    render: function() {
        return (
            <div>
            <CommentList comments={this.props.comments} />
            </div>
        );
    }
});

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
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
    },
    render: function() {
        var all_comments = [];
        this.props.comments.forEach(function(comment) {
            all_comments.push(
                <div className='comment'>
                    <div className='photo'>
                        <img src={comment.user.photo}/>
                    </div>
                    <div className='content'>
                        <div className='name'>{comment.user.first_name + ' ' + comment.user.last_name}</div>
                        <div className='date'>{comment.date}</div>
                        <div className='text'>{comment.text}</div>
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

var ItemHeader = React.createClass({
    render: function() {
        return (
            <div id='itemHeader'>
                <div onClick={this.props.backAction} className='backButton'>
                    <Icons.Dropback/>
                </div>
                <span>{this.props.title}</span>
                <button onClick={this.props.buttonAction}>
                    {this.props.currentRole.type == 'developer' ? 'Bid Now' : 'Find Talent'}
                </button>
            </div>
        );
    }
});


module.exports = SingleItemView;