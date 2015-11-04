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
        this.props.actions.getContracts()
    }
    handleUserInput(searchText) {
        this.setState({ searchText: searchText });
    }
    render() {
        const { contract, contracts, user, roles, actions } = this.props;
        if (!contracts.items.size && !contracts.isFetching) {
            return (
                <NothingHere>
                    <h3>You don't have any in progress tickets</h3>
                    <button>View Offered Tickets</button>
                </NothingHere>
            );
        }
        if (!!contract.id) {
            const work = contracts.items.get(contract.id).work;
            return <SingleContractView
                user={user}
                submitWork={actions.submitWork.bind(null, work)}
                disputeWork={actions.disputeWork.bind(null, work)}
                acceptWork={actions.acceptWork.bind(null, work)}
                markWorkBlocked={actions.markWorkBlocked.bind(null, work)}
                markWorkUnblocked={actions.markWorkUnblocked.bind(null, work)}
                contract={contracts.items.get(contract.id)}
                unselect={() => actions.selectContract(null)}
                role={roles.items.get(user.current_role.id)}/>;
        } else {
            return (
                <div className='contentView'>
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput }/>
                    <ContractList select={actions.selectContract} user={user} roles={roles} contracts={Array.from(contracts.items.values())} />
                </div>
            );
        }
    }
};

let mapStateToProps = state => ({ contracts: state.contracts, contract: state.contract });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ContractActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ContractView);
