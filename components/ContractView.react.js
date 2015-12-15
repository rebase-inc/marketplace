import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as ContractActions from '../actions/ContractActions';
import { COMPLETE } from '../constants/WorkStates';

// Components
import SearchBar from './SearchBar.react';
import NothingHere from './NothingHere.react';
import ContractListView from './ContractListView.react';
import SingleContractView from './SingleContractView.react';
import SortOptions from './SortOptions.react';

export default class ContractView extends Component {
    static propTypes = {
        user: PropTypes.object.isRequired,
        role: PropTypes.object.isRequired,
    }
    constructor(props, context) {
        super(props, context);

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
    render() {
        const { contractID, contracts, user, role, actions, selectView } = this.props;
        const contract = contractID ? contracts.items.get(contractID).toJS() : null;
        return (
            <div className='mainView'>
                <ContractListView role={role} contract={contract} contracts={contracts.items.toList().toJS()} loading={contracts.isFetching} select={actions.selectContract} selectView={selectView} />
                { contractID ? <SingleContractView contract={contract} actions={actions} role={role} user={user} /> : null }
            </div>
        );
    }
}

let mapStateToProps = state => ({ contracts: state.contracts, contractID: state.contractID });
let mapDispatchToProps = dispatch => ({ actions: bindActionCreators(ContractActions, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ContractView);
