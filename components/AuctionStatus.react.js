import React, { Component, PropTypes } from 'react';

function xValue(percentage, radius=46) {
    return radius * Math.sin(percentage*2*Math.PI);
}
function yValue(percentage, radius=46) {
    return radius * Math.cos(percentage*2*Math.PI);
}

export default class AuctionStatus extends Component {
    render() {
        const overbid = this.props.bids.filter(b => !b.contract).length;
        const approved = this.props.approved_talents.length - overbid;
        const suggested = this.props.ticket_set.nominations.filter(n => !this.props.approved_talents.find(t => t.contractor.id == n.contractor.id)).length;
        const total = 1.02 * (overbid + approved + suggested); // factor of 1.02 is to make sure start and end points aren't the same

        const xStart = 50;
        const yStart = 4;

        const xEndOverbid = 50 + xValue(overbid / total);
        const yEndOverbid = 50 - yValue(overbid / total);

        const xEndApproved = 50 + xValue((overbid + approved) / total);
        const yEndApproved = 50 - yValue((overbid + approved) / total);

        const overbidLargeArc = (overbid / total) > 0.5 ? 1 : 0;
        const approvedLargeArc = (approved / total) > 0.5 ? 1 : 0;
        const suggestedLargeArc = (suggested / total) > 0.5 ? 1 : 0;

        return (
            <svg width='100px' height='100px' viewBox='0 0 100 100'>
                <circle fill='none' stroke='#E5EDF1' strokeWidth='8' cx='50' cy='50' r='46'></circle>
                <circle fill={approved < 5 ? '#546C8A' : '#5FC0AA'} cx='50' cy='50' r='38'></circle>
                <path id='overbid' fill='none' stroke={'#CC6070'} strokeWidth='8'
                    d={'M' + xStart + ' ' + yStart + ' A 46 46 1 ' + overbidLargeArc + ' 1 ' + xEndOverbid + ' ' + yEndOverbid}/>
                <path id='approved' fill='none' stroke={'#546C8A'} strokeWidth='8'
                    d={'M' + xEndOverbid + ' ' + yEndOverbid + ' A 46 46 1 ' + approvedLargeArc + ' 1 ' + xEndApproved + ' ' + yEndApproved}/>
                <path id='suggested' fill='none' stroke={'#E5EDF1'} strokeWidth='8'
                    d={'M' + xEndApproved + ' ' + yEndApproved + ' A 46 46 1 ' + suggestedLargeArc + ' 1 ' + xStart + ' ' + yStart}/>
            </svg>
        );
    }
}
