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
        var ticket = this.props.contract.ticket;
        var className;
        // this needs to be reworked...status bar color should depend on role and state combination
        switch(this.props.currentRole.type) {
            case 'contractor':
                switch (this.props.contract.work.state) {
                    case 'in_progress': className = 'neutral'; break;
                    case 'in_review': className = 'notification'; break;
                    case 'blocked': className = 'needsResolution'; break;
                    case 'in_mediation': className = 'needsResolution'; break;
                }
                break;
            case 'manager':
                switch (this.props.contract.work.state) {
                    case 'in_progress': className = 'notification'; break;
                    case 'in_review': className = 'neutral'; break;
                    case 'blocked': className = 'needsResolution'; break;
                    case 'in_mediation': className = 'needsResolution'; break;
                }
                break;
        }
        return (
            <tr className='ticket noselect' onClick={this.props.selectContract.bind(null, this.props.contract.id)}>
                <td className={'statusPanel ' + className}></td>
                <ProjectInfoPanel ticket={ticket} />
                <td className='titlePanel'>{ticket.title}</td>
                <td className='skillsRequiredPanel'>{ticket.skillsRequired}</td>
                <td className='commentsPanel'>
                    <Icons.Comment/>
                    <span>{ticket.comments.length} Comments</span>
                </td>
            </tr>
        );
    }
});

module.exports = Contract;
