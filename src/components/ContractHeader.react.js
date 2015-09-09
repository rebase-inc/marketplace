// External
var React = require('react');

// Components
var Icons = require('../components/Icons.react');

// Constants
var ViewConstants = require('../constants/ViewConstants');
var ticketTypes = ViewConstants.ticketTypes;

var ContractHeader = React.createClass({
    propTypes: {
        actions: React.PropTypes.object.isRequired,
        currentContract: React.PropTypes.object.isRequired,
    },
    _makeButtons: function() {
        var buttons = [];
        switch (this.props.currentContract.work.state) {
            case 'in_progress':
                if (this.props.currentRole.type == 'contractor') {
                    buttons.push(<button onClick={this.props.actions.askForReview}>Finished</button>);
                    buttons.push(<button onClick={this.props.actions.haltWork} className='needsResolution'>Blocked</button>);
                    return buttons;
                } else if (this.props.currentRole.type == 'manager') {
                    return;
                } else { console.warn('Invalid role type for given state ', this.props.currentRole.type); }
                break;
            case 'in_review':
                if (this.props.currentRole.type == 'contractor') {
                    return;
                } else if (this.props.currentRole.type == 'manager') {
                    buttons.push(<button onClick={this.props.actions.markComplete}>Accept Work</button>);
                    buttons.push(<button onClick={this.props.actions.enterMediation} className='needsResolution'>Dispute</button>);
                    return buttons;
                } else { console.warn('Invalid role type for given state ', this.props.currentRole.type); }
                break;
            case 'blocked':
                buttons.push(<button onClick={this.props.actions.resumeWork}>Unblock</button>);
                return buttons;
                break;
            case 'in_mediation':
                buttons.push(<button onClick={this.props.actions.mediationAnswerFail}>Give Up</button>);
                buttons.push(<button onClick={this.props.actions.mediationAnswerComplete}>Resolve Issue</button>);
                buttons.push(<button onClick={this.props.actions.mediationAnswerResume}>Fix Client Issue</button>);
                return buttons;
                break;
            default: throw 'Invalid work state ' + this.props.currentContract.work.state; break;
        }
    },
    _getClassName: function() {
        var _classNames = {
            'in_progress' : { 'manager' : 'notifiation' },
            'in_review' : { 'contractor' : 'notification' },
            'blocked' : { 'contractor' : 'needsResolution', 'manager' : 'needsResolution' },
            'in_mediation' : { 'contractor' : 'needsResolution', 'manager' : 'needsResolution' },
        }
        return _classNames[this.props.currentContract.work.state][this.props.currentRole.type] || 'neutral';
    },
    render: function() {
        return (
            <div id='itemHeader' className={this._getClassName()}>
                <div onClick={this.props.goBack} className='backButton'> <Icons.Dropback/> </div>
                { this._makeButtons() }
                <span>{this.props.currentContract.ticket.title}</span>
            </div>
        );
    }
});

module.exports = ContractHeader;
