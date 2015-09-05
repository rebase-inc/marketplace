var React = require('react');

// Components
var ProjectInfoPanel = require('../components/ProjectInfoPanel.react');
var Icons = require('../components/Icons.react');

var Contract = React.createClass({
    propTypes: {
        currentRole: React.PropTypes.object.isRequired,
        contract: React.PropTypes.object.isRequired,
        selectContract: React.PropTypes.func.isRequired,
    },
    render: function() {
        var ticket = this.props.contract.bid.work_offers[0].ticket_snapshot.ticket;
        var state = this.props.contract.bid.work_offers[0].work.state
        var className;
        switch (state) {
            case 'in_progress': className = 'neutral'; break;
            case 'in_review': className = 'notification'; break;
            case 'blocked': className = 'needsResolution'; break;
            case 'in_mediation': className = 'needsResolution'; break;
        }
        return (
            <tr className='ticket'>
                <td className={'statusPanel ' + className}></td>
                <ProjectInfoPanel ticket={ticket} />
                <td className='titlePanel'>{ticket.title}</td>
                <td className='skillsRequiredPanel'>{ticket.skillsRequired}</td>
                <td className='commentsPanel' onClick={this.props.selectContract.bind(null, this.props.contract.id)}>
                    <Icons.Comment/>
                    <span>{ticket.comments.length} Comments</span>
                </td>
            </tr>
        );
    }
});

module.exports = Contract;
