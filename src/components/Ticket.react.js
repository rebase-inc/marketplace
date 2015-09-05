var React = require('react');

// Components
var FindTalentPanel = require('../components/FindTalentPanel.react');
var Icons = require('../components/Icons.react');

var Ticket = React.createClass({
    selectTicket: function() { this.props.selectTicket(this.props.ticket.id); },
    render: function() {
        var role = this.props.currentRole;
        return (
            <tr className='ticket'>
                <FindTalentPanel ticket={this.props.ticket} />
                <td className='titlePanel'>{this.props.ticket.title}</td>
                <td className='skillsRequiredPanel'>{this.props.ticket.skillsRequired}</td>
                <td className='commentsPanel' onClick={this.selectTicket}>
                    <Icons.Comment/>
                    <span>{this.props.ticket.comments.length} Comments</span>
                </td>
            </tr>
        );
    }
});

module.exports = Ticket;
