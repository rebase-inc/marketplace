// External
var _ = require('underscore');
var React = require('react');
var ReactDOM = require('react-dom');

// Stores
var ContractStore = require('../stores/ContractStore');

// Actions
var ContractActions = require('../actions/ContractActions');

// Components
var SearchBar = require('../components/SearchBar.react');
var ContractList = require('../components/ContractList.react');
var SingleContractView = require('../components/SingleContractView.react');

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
        if (!!this.state.currentContract) {
            return <SingleContractView {...this.props} {...this.state} unselectContract={this.selectContract.bind(null, null)} />;
        } else {
            var props = _.extend({ selectContract: this.selectContract, onUserInput: this.handleUserInput }, this.state, this.props);
            return (
                <div className='contractView'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}/>
                    <ContractList {...props} />
                </div>
            );
        }
    }
});

module.exports = ContractView;
