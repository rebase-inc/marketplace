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
                    <Tooltip placement="top" trigger={['click']} overlay={<span>tooltip</span>}>
                        <a href='#'>hover</a>
                    </Tooltip>
                </div>
           </div>
        );
    }
};
