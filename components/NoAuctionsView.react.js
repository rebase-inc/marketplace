import React, { Component, PropTypes } from 'react';

import NothingHere from './NothingHere.react';

import Tooltip from 'rc-tooltip';

import * as WalkthroughConstants from '../constants/WalkthroughConstants';
import WalkthroughStep from './WalkthroughStep.react';

export default class NoAuctionsView extends Component {
    static propTypes = {
        viewNewTickets: PropTypes.func.isRequired,
        role: PropTypes.object.isRequired,
    }
    render() {
        const { viewNewTickets, role, walkthrough, walkthroughActions } = this.props;
        const nothingHereString = role.type == 'manager' ?
            'Any tickets that you set a budget for will appear here with a summary of the data about the offer.' :
                'Any tickets that have been offered to you will appear here with information about who offered them to you.';
        const tooltipVisible = walkthrough.steps[walkthrough.current] == WalkthroughConstants.CURRENT_VIEW;
        const walkthroughProps = {
            title: 'You don\'t have any offered tickets',
            description: 'You can either check back in a few hours, or try out a sample piece of work for a $20 credit.',
            ...walkthroughActions
        };

        const extraButton = { name: 'Try Sample Work', fn: alert.bind(null, 'Not yet implemented') };

        return (
            <NothingHere>
                <h3>{ role.type == 'manager' ? 'Your Auctions' : 'Your Offers' }</h3>
                <Tooltip visible={tooltipVisible} overlay={<WalkthroughStep {...walkthroughProps} last={true} extra={extraButton} />} placement='top'>
                    <h4>{ nothingHereString }</h4>
                </Tooltip>
                { role.type == 'manager' ? <button onClick={viewNewTickets}>View New Tickets</button> :
                    <button>See Sample Offer</button> }
            </NothingHere>
        );
    }
}
