// External
var React = require('react/addons');

// Components
var Icons = require('../components/RebaseIcons.react');

// Constants
var ViewConstants = require('../constants/ViewConstants');
var ticketTypes = ViewConstants.ticketTypes;

var TicketHeader = React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired,
        goBack: React.PropTypes.func.isRequired,
    },
    render: function() {
        return (
            <div id='itemHeader' className={this.props.className || 'neutral'}>
                <div onClick={this.props.goBack} className='backButton'> <Icons.Dropback/> </div>
                { this.props.children }
                <span>{this.props.title}</span>
            </div>
        );
    }
});

module.exports = TicketHeader;
