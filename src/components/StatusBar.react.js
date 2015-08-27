React = require('react');

var StatusBar = React.createClass({
    render: function() {
        this.props.review.date = !!this.props.review.date ? this.props.review.date : 'August 12, 2015';
        return (
            <div id='statusBar' className='notification'>
                { 'Completed on ' + this.props.review.date + ' for $' + this.props.review.work.credit } 
            </div>
        );
    }
});


module.exports = StatusBar;
