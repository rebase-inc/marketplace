import React from 'react';

const DropdownIcon = (props) => (
    <svg data-selected={props.open || undefined } viewBox="0 0 22 14" onClick={props.onClick}>
        <g stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
            <rect fill="#EBEDF0" x="0" y="0" width="22" height="14" rx="2"></rect>
            <path d="M6,5 L11,10 L16,5" stroke="#F8FBFD" stroke-linecap="square"></path>
        </g>
    </svg>
);

export default DropdownIcon;
