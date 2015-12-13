import React, { Component, PropTypes } from 'react';

export default class BudgetPanel extends Component {
    static propTypes = {
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { debit } = this.props;
        return (
            <td className='debitPanel'>
                <span>{ debit.paid ? 'PAID' : 'TO BE PAID'}</span>
                <span data-alert={!debit.paid || undefined}>{'$' + debit.price}</span>
            </td>
        );
    }
}
