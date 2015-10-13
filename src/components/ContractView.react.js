// External
var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

// Constants
var ViewTypes = require('../constants/ViewConstants').ViewTypes;

// Stores
var ContractStore = require('../stores/ContractStore');

// Actions
var ContractActions = require('../actions/ContractActions');
var UserActions = require('../actions/UserActions');

// Components
var SearchBar = require('../components/SearchBar.react');
var ContractList = require('../components/ContractList.react');
var SingleContractView = require('../components/SingleContractView.react');
var NothingHere = require('../components/NothingHere.react');

var ContractView = React.createClass({
    propTypes: {
        currentUser: React.PropTypes.object.isRequired,
        currentRole: React.PropTypes.object.isRequired,
    },
    getInitialState: function() {
        return _.extend({ searchText: '' }, ContractStore.getState());
    },
    componentDidMount: function() {
        ContractStore.addChangeListener(this._onChange);
        setTimeout(ContractActions.getContractData, 0);
    },
    componentWillUnmount: function() {
        ContractStore.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.setState(ContractStore.getState());
    },
    selectContract: function(contractID) {
        ContractActions.selectContract(contractID);
    },
    handleUserInput: function(searchText) {
        this.setState({ searchText: searchText });
    },
    render: function() {
        if (!this.state.allContracts.length && !this.state.loading) {
            return (
                <NothingHere>
                    <h3>You don't have any in progress tickets</h3>
                    <button onClick={UserActions.selectView.bind(null, ViewTypes.OFFERED)}>View Offered Tickets</button>
                </NothingHere>
            );
        }
        switch (!!this.state.currentReview) {
            case true:
                return <SingleContractView {...this.props} {...this.state} unselectContract={this.selectContract.bind(null, null)} />;
                break;
            case false:
                var props = _.extend({ selectContract: this.selectContract, onUserInput: this.handleUserInput }, this.state, this.props);
                return (
                    <div className='contractView'>
                        <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}/>
                        <ContractList {...props} />
                    </div>
                );
                break;
        }
    }
});

module.exports = ContractView;
