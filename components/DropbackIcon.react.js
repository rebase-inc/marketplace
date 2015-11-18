import React, { Component, PropTypes } from 'react';

export default class Dropback extends Component {
    static propTypes = {
        onClick: PropTypes.func,
    }

    render() {
        return (
            <svg onClick={this.props.onClick} className='dropbackIcon' width="14px" height="24px" viewBox="0 0 14 23">
                <g transform="translate(13, 0) rotate(90)" fill="#2F4B6B">
                    <path d="M21.874649,1.48404626 L20.7743234,0.34128673 C20.6276314,0.188656928 20.4587869,0.112622596 20.2677901,0.112622596 C20.0773335,0.112622596 19.9084891,0.188656928 19.761797,0.34128673 L11.1115578,9.32484123 L2.46158875,0.3415673 C2.31489669,0.188937497 2.14605223,0.112903166 1.95532553,0.112903166 C1.76459884,0.112903166 1.59575438,0.188937497 1.44906231,0.3415673 L0.34873676,1.48432683 C0.201774545,1.63667607 0.128563589,1.812032 0.128563589,2.01011406 C0.128563589,2.20819612 0.202044696,2.38355205 0.34873676,2.53590128 L10.6052946,13.1882831 C10.7519866,13.3406323 10.9208311,13.4166667 11.1115578,13.4166667 C11.3022845,13.4166667 11.4708588,13.3406323 11.6175509,13.1882831 L21.874649,2.53590128 C22.0213411,2.38355205 22.0942819,2.20819612 22.0942819,2.01011406 C22.0942819,1.812032 22.0213411,1.63667607 21.874649,1.48404626 L21.874649,1.48404626 Z" />
                </g>
            </svg>
        );
    }
};
