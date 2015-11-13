import React, { Component, PropTypes } from 'react';

export default class PlusIcon extends Component {
    render() {
        // react doesnt yet support the svg mask attribute, so you'll see a mask definition
        // below, as well as an overlay of the same exact element in a light color (that attempts
        // to match the background). If you run across this, it might be worth checking to see if
        // React now supports the mask attribute, at which point you should be able to remove the
        // second g element (id'ed as mask-hack)
        const { text } = this.props;
        return (
            <svg width="105px" height="30px" viewBox='0 0 105 30' onClick={this.props.onClick}>
                <defs>
                    <mask id="plusMask">
                        <g width='12px' transform='translate(89.0, 4.0)' strokeWidth="1" fill="none">
                            <path d="M11.54174,6.47261538 L11.54174,6.47261538 L6.41564337,6.468 L6.41564337,11.5384615 C6.41564337,11.7941538 6.21034288,12 5.95738335,12 C5.70350729,12 5.49912332,11.7941538 5.49912332,11.5384615 L5.49912332,6.46707692 L0.457346559,6.46153846 C0.204387027,6.46153846 -0.000913463235,6.25476923 3.05680905e-06,6 C3.05680905e-06,5.74523077 0.205303547,5.53846154 0.458263079,5.53846154 L0.458263079,5.53846154 L5.49912332,5.544 L5.49912332,0.461538462 C5.49912332,0.206769231 5.70350729,0 5.95738335,0 C6.21034288,0 6.41564337,0.206769231 6.41564337,0.461538462 L6.41564337,5.54492308 L11.5426565,5.54953846 C11.795616,5.54953846 12,5.75630769 12,6.01107692 C12,6.26584615 11.7946995,6.47261538 11.54174,6.47261538 L11.54174,6.47261538 Z" fill="#F2F6F8"></path>
                        </g>
                    </mask>
                </defs>
                <g strokeWidth="1" fill="#D6DBE3">
                    <circle fill="#C3CAD4" cx="95" cy="10" r="10" mask='url(#plusMask)'></circle>
                </g>
                <g width='12px' transform='translate(89.0, 4.0)' strokeWidth="1" fill="none">
                    <path d="M11.54174,6.47261538 L11.54174,6.47261538 L6.41564337,6.468 L6.41564337,11.5384615 C6.41564337,11.7941538 6.21034288,12 5.95738335,12 C5.70350729,12 5.49912332,11.7941538 5.49912332,11.5384615 L5.49912332,6.46707692 L0.457346559,6.46153846 C0.204387027,6.46153846 -0.000913463235,6.25476923 3.05680905e-06,6 C3.05680905e-06,5.74523077 0.205303547,5.53846154 0.458263079,5.53846154 L0.458263079,5.53846154 L5.49912332,5.544 L5.49912332,0.461538462 C5.49912332,0.206769231 5.70350729,0 5.95738335,0 C6.21034288,0 6.41564337,0.206769231 6.41564337,0.461538462 L6.41564337,5.54492308 L11.5426565,5.54953846 C11.795616,5.54953846 12,5.75630769 12,6.01107692 C12,6.26584615 11.7946995,6.47261538 11.54174,6.47261538 L11.54174,6.47261538 Z" fill="#F2F6F8"></path>
                </g>
                <text fontSize="12px">
                    <tspan x="0" y="15" fill="#C3CAD4">{ text }</tspan>
                </text>
            </svg>
        );
    }
};
