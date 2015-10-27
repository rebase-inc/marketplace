import React, { Component } from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ContractActions from '../actions/ContractActions';

// Components
import SearchBar from './SearchBar.react';
import NothingHere from './NothingHere.react';
import ContractList from './ContractList.react';
import SingleContractView from './SingleContractView.react';

export default class ContractView extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        roles: React.PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', modalOpen: false };

        // TODO: Look into autobinding. React-redux examples projects have it, but not sure what they use
        this.handleUserInput = this.handleUserInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    componentDidMount() {
        this.props.actions.getContracts();
    }
    handleUserInput(searchText) {
        this.setState({ searchText: searchText });
    }
    render() {
        const { contract, contracts, user, roles } = this.props;

        if (!contracts.items.size && !contracts.isFetching) {
            return (
                <NothingHere>
                    <h3>You don't have any in progress tickets</h3>
                    <button>View Offered Tickets</button>
                </NothingHere>
            );
        }
        switch (!!contract) {
            case true:
                return <div>temp single contract view</div>;
                return <SingleContractView />;
                break;
            case false:
                return (
                    <div className='ticketView'>
                        <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput }/>
                        <ContractList contracts={Array.from(contracts.items.values())} />
                    </div>
                );
                break;
        }
    }
};

let mapStateToProps = state => ({ contracts: state.contracts, contract: state.contract });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ContractActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ContractView);
