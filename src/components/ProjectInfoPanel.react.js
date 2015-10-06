var React = require('react');

// Components
var RatingStars = require('../components/RatingStars.react');

var ProjectInfoPanel = React.createClass({
    render: function() {
        return (
            <td onClick={this.handleClick} className='projectInfoPanel'>
            <span>{this.props.ticket.project.name}</span>
            <span>{this.props.ticket.project.organization.name}</span>
            <RatingStars rating={this.props.ticket.project.rating || 3} />
            </td>
        );
    }
});

module.exports = ProjectInfoPanel;
