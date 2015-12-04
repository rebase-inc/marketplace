import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ContractActions from '../actions/ContractActions';
import { COMPLETE } from '../constants/WorkStates';
import { OFFERED } from '../constants/ViewConstants';

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
        if (prevProps.user.current_role.id != this.props.user.current_role.id) {
            this.props.actions.getContracts()
        }
    }
    handleUserInput(searchText) {
        this.setState({ searchText: searchText });
    }
    render() {
        const { contract, contracts, user, roles, actions, selectView } = this.props;
        const viewableContracts = Array.from(contracts.items.values()).filter(c => _shouldBeVisible(c));
        const isManager = roles.items.get(user.current_role.id).type == 'manager';
        if (!viewableContracts.length && !contracts.isFetching) {
            const nothingHereString = isManager ?
                'Any tickets that you have currently being worked on will show up here with a summary of who is working on it and its status.' :
                    'Any work that you\'re in the progress of completing will show up here with a summary of who the work is for and its status.';
            return (
                <NothingHere>
                    <h3>{'Your Current Work'}</h3>
                    <h4>{ nothingHereString }</h4>
                    <button onClick={selectView.bind(null, OFFERED)}>{ isManager ? 'View Auctions' : 'View Offers' }</button>
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
