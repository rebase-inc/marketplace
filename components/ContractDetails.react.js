import React, { Component, PropTypes } from 'react';

import CodeField from './CodeField.react';

import { getContractWork, getContractTicket } from '../utils/getters';

export default class ContractDetails extends Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const { contract } = this.props;
        const work = getContractWork(contract);
        return (
            <div className='scrollable talentList'>
                <CodeField name='' value={work.clone} />
            </div>
        );
    }
}
