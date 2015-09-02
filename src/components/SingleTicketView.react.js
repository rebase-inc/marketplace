// External
var React = require('react/addons');

var SingleTicketView = React.createClass({
    render: function() {
        if (!this.props.children) { console.warn('Did you mean to provide children to the single ticket view?'); }
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
