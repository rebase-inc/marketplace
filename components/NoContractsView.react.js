import React, { Component, PropTypes } from 'react';

import NothingHere from './NothingHere.react';

import { OFFERED } from '../constants/ViewConstants';

import { selectView }  from '../actions/UserActions';

export default class NoContractsHere extends Component {
    static propTypes = {
        role: PropTypes.object.isRequired,
    }
    render() {
        const { role } = this.props;
        const nothingHereString = role.type == 'manager' ?
            'Any tickets that you have currently being worked on will show up here with a summary of who is working on it and its status.' :
                'Any work that you\'re in the progress of completing will show up here with a summary of who the work is for and its status.';
        return (
            <NothingHere>
                <h3>{'Your Current Work'}</h3>
                <h4>{ nothingHereString }</h4>
                <button onClick={selectView.bind(null, OFFERED)}>{ role.type == 'manager' ? 'View Auctions' : 'View Offers' }</button>
            </NothingHere>
        );
    }
}
