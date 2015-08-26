// External
var React = require('react/addons');

var SingleTicketView = React.createClass({
    propTypes: {
        children: React.PropTypes.object.isRequired,
    },
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
