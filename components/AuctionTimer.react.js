import React, { Component, PropTypes } from 'react';

function xValue(percentage, radius=46) {
    return radius * Math.sin(percentage*2*Math.PI);
}
function yValue(percentage, radius=46) {
    return radius * Math.cos(percentage*2*Math.PI);
}

export default class AuctionTimer extends Component {
    render() {
        const timeRemaining = new Date(this.props.expires) - new Date();
        const auctionLength = new Date(this.props.expires) - new Date(this.props.created);
        const percentage = timeRemaining/auctionLength;
        const largeArc = percentage < 0.5 ? 0: 1;
        const x = 50 + xValue(percentage);
        const y = 50 - yValue(percentage);
        const color = percentage > 0.3 ? '#546C8A' : '#EDB245';
        return (
            <svg width='100px' height='100px' viewBox='0 0 100 100'>
                <circle fill='none' stroke='#E5EDF1' strokeWidth='8' cx='50' cy='50' r='46'></circle>
                <circle fill={'#E5EDF1'} cx='50' cy='50' r='38'></circle>
                <path fill={color} transform='translate(12, 12)' d="M56.9248121,56.8232845 C56.6722687,57.0936845 56.3329932,57.2288845 55.9911668,57.2288845 C55.6799517,57.2288845 55.3687366,57.116643 55.1212951,56.8870581 L36.1550309,39.1962657 C35.8973857,38.956477 35.7494309,38.6172015 35.7494309,38.2651713 L35.7494309,20.5743789 C35.7494309,19.8703185 36.3208423,19.2989072 37.0249026,19.2989072 C37.731514,19.2989072 38.3003743,19.8703185 38.3003743,20.5743789 L38.3003743,37.7090657 L56.8610385,55.0223185 C57.3763291,55.5018958 57.4043894,56.307994 56.9248121,56.8232845 M38.3003743,0.00102037736 C17.2015215,0.00102037736 0.0362233962,17.1663185 0.0362233962,38.2651713 C0.0362233962,59.3640242 17.2015215,76.5293223 38.3003743,76.5293223 C59.3992272,76.5293223 76.5645253,59.3640242 76.5645253,38.2651713 C76.5645253,17.1663185 59.3992272,0.00102037736 38.3003743,0.00102037736"></path>
                <path fill='none' stroke={color} strokeWidth='8'
                d={'M50 4 A 46 46 1 ' + largeArc + ' 1 ' + x + ' ' + y}/>
            </svg>

        );
    }
}
