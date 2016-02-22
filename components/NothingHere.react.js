import React, { Component, PropTypes } from 'react';

import DesktopComputerGraphic from './DesktopComputerGraphic.react';
import KeyboardGraphic from './KeyboardGraphic.react';
import HeadphonesGraphic from './HeadphonesGraphic.react';

import Tooltip from 'rc-tooltip';

export default class NothingHere extends Component {
    render() {
        return (
            <div className='contentView' id='nothingHere'>
                <DesktopComputerGraphic />
                <KeyboardGraphic />
                <HeadphonesGraphic />
                <div id='content'>
                    { this.props.children }
                </div>
           </div>
        );
    }
};
