import React from 'react';

const RejectedIcon = (props) => (
    <svg className='approve' onClick={props.onClick} width="20px" height="20px" viewBox="0 0 20 20">
        <g stroke="none" fill="#BF3F52">
            <circle cx='10' cy='10' r='10' />
            <text>
                <tspan fill='#F8FBFD' textAnchor='middle' x='10' y='14' fontSize='14' fontWeight='bold'>{'!'}</tspan>
            </text>
        </g>
    </svg>
);

export default RejectedIcon;
