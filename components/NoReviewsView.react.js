import React, { Component, PropTypes } from 'react';

import NothingHere from './NothingHere.react';

export default class NoAuctionsView extends Component {
    static propTypes = {
        viewContracts: PropTypes.func.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { viewContracts, role } = this.props;
        const nothingHereString = role.type == 'manager' ?
            'Once you\'ve had some work completed, it will show up here.' :
                'Once you\'ve completed some work, it will show up here.';
        return (
            <NothingHere>
                <h3>{'Your completed work'}</h3>
                <h4>{ nothingHereString }</h4>
                <button onClick={viewContracts}>{'View Current Work'}</button>
            </NothingHere>
        );
    }
}
