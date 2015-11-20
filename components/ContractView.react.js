import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ContractActions from '../actions/ContractActions';

// Components
import SearchBar from './SearchBar.react';
import NothingHere from './NothingHere.react';
import ContractList from './ContractList.react';
import SingleContractView from './SingleContractView.react';


// hack to only show not completed contracts. This really should be handled by the api
function _shouldBeVisible(contract) {
    return (contract.work.state != 'complete')
}

export default class ContractView extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        roles: React.PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '' };

        // TODO: Look into autobinding. React-redux examples projects have it, but not sure what they use
        this.handleUserInput = this.handleUserInput.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }
    componentDidMount() {
        this.props.actions.getContracts()
    }
    componentDidUpdate(prevProps) {
        if (prevProps.user.current_role != this.props.user.current_role) {
            this.props.actions.getContracts()
        }
    }
    handleUserInput(searchText) {
        this.setState({ searchText: searchText });
    }
    render() {
        const { contract, contracts, user, roles, actions } = this.props;
        const viewableContracts = Array.from(contracts.items.values()).filter(c => _shouldBeVisible(c));
        if (!viewableContracts.length && !contracts.isFetching) {
            return (
                <NothingHere>
                    <h3>You don't have any in progress tickets</h3>
                    <button>View Offered Tickets</button>
                </NothingHere>
            );
        }
        if (!!contract.id) {
            return <SingleContractView user={user}
                actions={actions}
                contract={contracts.items.get(contract.id)}
                unselect={() => actions.selectContract(null)}
                role={roles.items.get(user.current_role.id)}/>;
        } else {
            return (
                <div className='contentView'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput }/>
                    <ContractList select={actions.selectContract} user={user} roles={roles} contracts={viewableContracts} />
                </div>
            );
        }
    }
};

let mapStateToProps = state => ({ contracts: state.contracts, contract: state.contract });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ContractActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ContractView);
