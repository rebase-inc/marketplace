import React from 'react';

const NewTicketIcon = (props) => (
    <svg onClick={props.onClick} className='newTicket' width="30px" height="31px" viewBox="0 0 30 31">
        <g stroke="#546C8A" strokeWidth="1" fill="none">
            <path d="M20.0415,28.2393 L15.6285,29.5003 L16.8895,25.0873 L26.3475,15.6293 L29.4995,18.7813 L20.0415,28.2393 L20.0415,28.2393 Z"></path>
            <path d="M23.8262,18.1509 L26.9782,21.3029"></path>
            <path d="M16.8892,25.0869 L20.0412,28.2389"></path>
            <path d="M15.5,18.5 L10.5,18.5 L5.544,23.196 L5.544,18.5 L0.5,18.5 L0.5,0.5 L26.5,0.5 L26.5,12.5"></path>
        </g>
    </svg>
);

export default NewTicketIcon;
