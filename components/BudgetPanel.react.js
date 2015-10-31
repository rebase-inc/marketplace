import React, { Component, PropTypes } from 'react';

export default class BudgetPanel extends Component {
    static propTypes = {
        auction: PropTypes.object.isRequired,
    }
    render() {
        const { auction } = this.props;
        return (
            <td className='budgetPanel'>
                <span>BUDGET</span>
                <span>{'$' + auction.ticket_set.bid_limits[0].price}</span>
            </td>
        );
    }
}
