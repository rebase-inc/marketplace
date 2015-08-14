var React = require('react/addons');
var TicketStore = require('../stores/TicketStore');

var RebaseActions = require('../actions/RebaseActions');
var Icons = require('../components/RebaseIcons.react');

var SingleTicketView = React.createClass({
    getInitialState: function() {
        return { view: 'viewingComments' }
    },

    render: function() {
        return (
            <div id='singleTicketView' className='mainContent'>
            <div id='singleTicket'>
            <TicketHeader unselectTicket={this.props.unselectTicket} title={this.props.ticket.title} view={this.state.view}/>
            <CommentList comments={this.props.ticket.comments}/>
            <CommentBox ticket={this.props.ticket} user={this.props.user} />
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
        RebaseActions.commentOnIssue(this.props.user, this.props.ticket, this.state.commentText)
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
    componentWillUpdate: function() {
        var node = this.getDOMNode();
        this.shouldScrollBottom = node.scrollTop + node.offsetHeight === node.scrollHeight;
    },
    componentDidUpdate: function() {
        if (this.shouldScrollBottom) {
            var node = this.getDOMNode();
            node.scrollTop = node.scrollHeight
        }
    },
    componentDidMount: function() {
        var node = this.getDOMNode();
        node.scrollTop = node.scrollHeight
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

var TicketHeader = React.createClass({
    render: function() {
        return (
            <div id='ticketHeader'>
                <div onClick={this.props.unselectTicket} className='backButton'>
                <Icons.Dropback/>
                </div>
                <span>{this.props.title}</span>
                <button>Find Talent</button>
            </div>
        );
    }
});


module.exports = SingleTicketView;
