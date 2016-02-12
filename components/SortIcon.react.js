import React from 'react';

const SortIcon = (props) => (
    <svg className='sort' width="17px" height="30px" viewBox="0 0 17 30" onClick={props.onClick}>
        <g fill='none' strokeWidth='1px' transform="translate(8.500000, 15.500000) scale(-1, 1) translate(-8.500000, -15.500000) translate(0.000000, 1.000000)" stroke="#546C8A">
            <path d="M5.5,28.502 L5.5,10.85"></path>
            <path d="M11.5,17.1533 L11.5,-0.4977"></path>
            <path d="M10.5,23.502 L5.5,28.502 L0.5,23.502"></path>
            <path d="M16.5,4.502 L11.5,-0.498 L6.5,4.502"></path>
        </g>
    </svg>
);

export default SortIcon;
