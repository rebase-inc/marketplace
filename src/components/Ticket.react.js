var React = require('react');

// Components
var FindTalentPanel = require('../components/FindTalentPanel.react');
var Icons = require('../components/Icons.react');

var MonthNames = ['January', 'February', 'March', 'April', 'May', 
    'June', 'July', 'August', 'September', 'October', 'November', 'December']

var Ticket = React.createClass({
    changeSearchText: function(skill, event) {
        switch (event.shiftKey) {
            case true: this.props.changeSearchText(this.props.searchText + ' ' + skill); break;
            case false: this.props.changeSearchText(skill); break;
        }
        event.stopPropagation();
    },
    render: function() {
        let date = new Date(this.props.ticket.created);
        let dateString = MonthNames[date.getMonth()] + ' ' + date.getDate(); 
        let role = this.props.currentRole;
        return (
            <tr className='ticket' onClick={this.props.selectTicket.bind(null, this.props.ticket.id)}>
                <td className='datePanel'>
                    <span>Created</span> 
                    <span>{dateString}</span>
                </td>
                <td className='titlePanel'>
                    <span>{this.props.ticket.title}</span>
                </td>
                <td className='skillsRequiredPanel'>
                    <div className='skills'>
                        { Object.keys(this.props.ticket.skill_requirement.skills).map((skill) =>
                           <div key={skill} className='skill' onClick={this.changeSearchText.bind(null, skill)}>{skill}</div>) }
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
