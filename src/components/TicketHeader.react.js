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
        var buttons = [];
        var makeButton = function(props) {
            return <button onClick={props.onClick} className={props.className}>{props.text}</button>;
        }
        //switch (this.props.ticket.type) {
            //case ticketTypes.NEW:
                //buttons = this.props.currentRole.type == 'developer' ?  [] : [{ onClick: this.props.buttonAction, text: 'Find Talent' }];
            //break;
            //case ticketTypes.OFFERED:
                //buttons = this.props.currentRole.type == 'developer' ?  [{ onClick: this.props.buttonAction, text: 'Bid Now' }] : [];
            //break;
            //case ticketTypes.IN_PROGRESS:
                //buttons = this.props.currentRole.type == 'developer' ?
                    //[{onClick: this.props.buttonAction, text: 'Finish' },
                        //{ onClick: this.props.buttonAction, text: 'Mark Blocked', className: 'danger' }] : [];
            //break;
            //case ticketTypes.COMPLETED: break;
        //}
        return (
            <div id='itemHeader'>
                <div onClick={this.props.goBack} className='backButton'>
                    <Icons.Dropback/>
                </div>
                { buttons.map(makeButton) }
                <span>{this.props.title}</span>
            </div>
        );
    }
});

module.exports = TicketHeader;
