// External
var React = require('react/addons');

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
        RebaseActions.commentOnTicket(this.props.user, this.props.ticket, this.state.commentText);
        //if (!!this.props.ticket) {
            //RebaseActions.commentOnTicket(this.props.user, this.props.ticket, this.state.commentText);
        //}
        //else if (!!this.props.auction) {
            //RebaseActions.commentOnAuction(this.props.user, this.props.auction, this.state.commentText);
        //}
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

module.exports = CommentBox;