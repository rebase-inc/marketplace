var React = require('react');

// Components
var LoadingAnimation = require('../components/LoadingAnimation.react');
var NothingHere = require('../components/NothingHere.react');
var Contract = require('../components/Contract.react');

var ContractList = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
        selectContract: React.PropTypes.func.isRequired,
    },
    render: function() {
        var props = {
            selectContract: this.props.selectContract,
            currentRole: this.props.currentRole,
        }
        var titleMatchesText = function(contract) {
            return true; // until we make this actually work
            return contract.title.indexOf(this.props.searchText) != -1;
        }.bind(this);
        var makeTicketElement = function(contract) {
            return <Contract contract={contract} key={contract.id} {...props} />;
        }.bind(props);
        if (!!this.props.allContracts.length) {
            return (
                <table className='contentList'>
                    <tbody>
                        { this.props.allContracts.filter(titleMatchesText).map(makeTicketElement) }
                    </tbody>
                </table>
            );
        } else if (this.props.loadingContractData) {
            return <div className='contentList'><LoadingAnimation /></div>;
        } else {
            return <NothingHere text={'You don\'t have any in progress work right now. Check out offered tickets to find some!'}/>;
        }
    }
});

module.exports = ContractList;
