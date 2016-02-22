import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ContractActions from '../actions/ContractActions';
import * as NotificationActions from '../actions/NotificationActions';
import { COMPLETE } from '../constants/WorkStates';
import { ENDS_SOON, TIME_LEFT } from '../utils/sort';

// Components
import Contract from './Contract.react';
import SearchBar from './SearchBar.react';
import SortIcon from './SortIcon.react';
import NoContractsView from './NoContractsView.react';
import SingleContractView from './SingleContractView.react';
import SortOptions from './SortOptions.react';
import ListTitleBar from './ListTitleBar.react';

class ContractView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentDidUpdate = this.componentDidUpdate.bind(this);
        this.state = { sort: ENDS_SOON };
    }
    componentDidMount() {
        this.props.actions.getContracts()
    }
    componentDidUpdate(prevProps) {
        // If the role has changed, we want to make sure to get the new role's contracts
        if (prevProps.user.current_role.id != this.props.user.current_role.id) {
            this.props.actions.getContracts()
        }
    }
    render() {
        const { contract, contracts, searchText, updateSearchText, user, role, actions, selectView } = this.props;
        if (!contracts.length) { return <NoContractsView {...this.props} /> }
        return (
            <div className='mainView'>
                <div className='listView noselect'>
                    <ListTitleBar title={'All Ongoing Work'}>
                        <SortIcon onClick={() => this.setState((s) => ({ sort: s.sort == ENDS_SOON ? TIME_LEFT : ENDS_SOON }))}/>
                    </ListTitleBar>
                    <div className='scrollable'>
                        <SearchBar searchText={searchText} onChange={updateSearchText} />
                        { contracts.sort(this.state.sort).map(c => <Contract {...c} role={role} handleClick={actions.selectContract.bind(null, c.id)} selected={c.id == contract.id} />) }
                    </div>
                </div>
                { contract ? <SingleContractView contract={contract} actions={actions} role={role} user={user} /> : null }
            </div>
        );
    }
}

let mapStateToProps = state => ({
    contracts: state.contracts.items.toList().toJS(),
    contract: state.contractID ? state.contracts.items.get(state.contractID).toJS() : null,
});
let mapDispatchToProps = dispatch => ({
    actions: Object.assign({},
               bindActionCreators(ContractActions, dispatch),
               bindActionCreators(NotificationActions, dispatch))
})
export default connect(mapStateToProps, mapDispatchToProps)(ContractView);
