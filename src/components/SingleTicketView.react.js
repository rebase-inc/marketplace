
var SingleTicket = React.createClass({
    getInitialState: function() {
        return { view: 'viewingComments' }
    },
    render: function() {
        return (
            <div id='singleTicketView' className='mainContent'>
            <div id='singleTicket'>
            <TicketHeader title={this.props.ticket.title} view={this.state.view}/>
            <CommentList comments={this.props.ticket.comments}/>
            <div id='newCommentBox'><textarea type='text' placeholder='Leave a comment'/></div>
            </div>
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

var CommentList = React.createClass({
    render: function() {
        var all_comments = [];
        this.props.comments.forEach(function(comment) {
            all_comments.push(
                <div className='comment'>
                    <div className='photo'>
                        <img src='img/andrew.png'/>
                    </div>
                    <div className='content'>
                        <div className='name'>{comment.name}</div>
                        <div className='date'>{comment.date}</div>
                        <div className='text'>{comment.text}</div>
                    </div>
                </div>
            );
        });
        return ( <div id='commentList'> {all_comments} </div>);
    }
});

