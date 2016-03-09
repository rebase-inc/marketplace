import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import ListView from './ListView.react';
import { selectContract } from '../actions/ContractActions';
import Contract from './Contract.react';
import { searchContracts } from '../utils/search';
import { getContractTicket } from '../utils/getters';


export class ContractListView extends ListView {
    constructor(props, context) {
        super(props, context);
        this.getTicket = getContractTicket;
        this.Item = Contract;
    }
}

let mapStateToProps = function (state) {
    const _contracts = state.contracts.items.toList().toJS();
    return {
        items: _contracts,
        loading: state.contracts.isFetching,
        search: searchContracts(_contracts),
    };
}

let mapDispatchToProps = dispatch => ({ selectView: bindActionCreators(selectContract, dispatch)});
export default connect(mapStateToProps, mapDispatchToProps)(ContractListView);
