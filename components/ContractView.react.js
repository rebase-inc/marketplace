import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ContractActions from '../actions/ContractActions';
import { COMPLETE } from '../constants/WorkStates';

// Components
import SearchBar from './SearchBar.react';
import NothingHere from './NothingHere.react';
import ContractList from './ContractList.react';
import SingleContractView from './SingleContractView.react';
import SortOptions from './SortOptions.react';


// hack to only show not completed contracts. This really should be handled by the api
function _shouldBeVisible(contract) {
    return (contract.work.state != COMPLETE);
}

const SortFunctions = new Map([
    ['finishing soon', (a, b) => new Date(a.bid.auction.finish_work_by) - new Date(b.bid.auction.finish_work_by) ],
    ['time left', (a, b) => new Date(b.bid.auction.finish_work_by) - new Date(a.bid.auction.finish_work_by) ],
    ['blocked', (a, b) => b.work.state == 'blocked' ],
    ['in review', (a, b) => b.work.state == 'in_review' ],
    ['in progress', (a, b) => b.work.state == 'in_progress' ],
    //['recent comments', (a, b) => a.work.comments[0] != b.work.state ], // TODO: Implement once work comments are working
]);

export default class ContractView extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        roles: React.PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.state = { searchText: '', sort: SortFunctions.get('finishing soon') };

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
                    <SearchBar searchText={this.state.searchText} onUserInput={this.handleUserInput}>
                        <SortOptions options={SortFunctions} select={(fn) => this.setState({ sort: fn })} sort={this.state.sort} />
                    </SearchBar>
                    <ContractList
                        sort={this.state.sort}
                        searchText={this.state.searchText}
                        select={actions.selectContract}
                        role={roles.items.get(user.current_role.id)}
                        contracts={viewableContracts}
                        loading={contracts.isFetching} />
                </div>
            );
        }
    }
};

let mapStateToProps = state => ({ contracts: state.contracts, contract: state.contract });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ContractActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ContractView);
