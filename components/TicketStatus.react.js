import React, { Component, PropTypes } from 'react';

function xValue(percentage, radius=46) {
    return radius * Math.sin(percentage*2*Math.PI);
}
function yValue(percentage, radius=46) {
    return radius * Math.cos(percentage*2*Math.PI);
}

function calculatePercentage(props) {
    let reason = '';
    let skills = Object.keys(props.skill_requirement.skills).length;

    // intentionally doesnt sum to 1
    const titlePenalty = 0.40 * Math.max(20 - props.title.length, 0) / 20;
    const commentsPenalty = 0.30 * Math.max(1 - Math.pow(0.15 * props.comments.length, 0.25), 0);
    const skillsPenalty = 0.25 * Math.max(5 - skills, 0) / 5;
    const percentage = 0.95 - titlePenalty - commentsPenalty - skillsPenalty; 

    if (percentage >= 0.80) {
        reason = 'Devs Waiting';
    } else if (titlePenalty > skillsPenalty && titlePenalty > commentsPenalty) {
        reason = 'Add Title';
    } else if (skillsPenalty >= commentsPenalty) {
        reason = 'Add Tech';
    } else if (commentsPenalty > 0) {
        reason = 'Add Description';
    }

    return { percentage: percentage, reason: reason };
}

export default class TicketStatus extends Component {
    render() {
        const { percentage, reason } = calculatePercentage(this.props);
        const largeArc = percentage < 0.5 ? 0: 1;
        const x = 50 + xValue(percentage);
        const y = 50 - yValue(percentage);
        const color = percentage > 0.8 ? '#5FC0AA' : '#546C8A';
        return (
            <svg width='100px' height='100px' viewBox='0 0 100 100'>
                <circle fill='none' stroke='#E5EDF1' strokeWidth='8' cx='50' cy='50' r='46'></circle>
                <path fill='none' stroke={color} strokeWidth='8'
                d={'M50 4 A 46 46 1 ' + largeArc + ' 1 ' + x + ' ' + y}/>
                <text>
                    <tspan x='50' y='45' textAnchor='middle' fontSize='18px' fill={color}>{ reason.split(' ')[0] }</tspan>
                    <tspan x='50' y='65' textAnchor='middle' fontSize='18px' fill={color}>{ reason.split(' ')[1] }</tspan>
                </text>
            </svg>

        );
    }
}
