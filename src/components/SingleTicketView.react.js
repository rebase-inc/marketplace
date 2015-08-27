// External
var React = require('react/addons');

var SingleTicketView = React.createClass({
    render: function() {
        return (
            <div id='singleItemView' className='mainContent'>
                <div id='singleItem'>
                    { this.props.children }
                </div>
            </div>
        );
    }
});

module.exports = SingleTicketView;
