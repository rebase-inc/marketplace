var React = require('react');

// Components
var FindTalentPanel = require('../components/FindTalentPanel.react');
var Icons = require('../components/Icons.react');

var Ticket = React.createClass({
    render: function() {
        var role = this.props.currentRole;
        return (
            <tr className='ticket' onClick={this.props.selectTicket.bind(null, this.props.ticket.id)}>
                <FindTalentPanel onClick={this.props.findTalent.bind(null, this.props.ticket.id)} />
                <td className='titlePanel'>{this.props.ticket.title}</td>
                <td className='skillsRequiredPanel'>
                    <div className='skills'>
                        { this.props.ticket.skillsRequired.map((skill) => <div className='skill'>{skill}</div>) }
                    </div>
                </td>
                <td className='spacerPanel'></td>
                <td className='commentsPanel'>
                    <Icons.Comment/>
                    <span>{this.props.ticket.comments.length} Comments</span>
                </td>
            </tr>
        );
    }
});

module.exports = Ticket;
