import React, { Component, PropTypes } from 'react';

export default class OfferPanel extends Component {
    static propTypes = {
        offer: PropTypes.object.isRequired,
    }

    render() {
        const { offer } = this.props;
        let user = offer.contractor.user;
        let name = user.first_name+' '+user.last_name
        let contractorString = 'Assigned to '+name
        return (
            <div id='offerPanel'>
                <span>{contractorString}</span>
            </div>
        );
    }
};
