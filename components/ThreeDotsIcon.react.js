import React, { Component, PropTypes } from 'react';

export default class ThreeDotsIcon extends Component {
    static propTypes = {
        onClick: PropTypes.func,
    }

    render() {
        return (
            <svg onClick={this.props.onClick} className='threeDotsIcon' width="26px" height="6px" viewBox="0 0 26 6">
                <g id="UI" stroke="none" fill="#2C4568">
                    <circle cx="3" cy="3" r="3" />
                    <circle cx="13" cy="3" r="3" />
                    <circle cx="23" cy="3" r="3" />
                </g>
            </svg>
        );
    }
};

