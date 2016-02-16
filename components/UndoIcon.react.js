import React from 'react';

const UndoIcon = (props) => (
    <svg className='undo' onClick={props.onClick} width="20px" height="20px" viewBox="0 0 20 20">
        <g stroke="none" fill="#F2B046">
            <path d="M10,20 C15.5228475,20 20,15.5228475 20,10 C20,4.4771525 15.5228475,0 10,0 C4.4771525,0 0,4.4771525 0,10 C0,15.5228475 4.4771525,20 10,20 Z M7.1892941,11.8733032 C7.0247152,11.7225956 4,8.82158565 4,8.5125333 C4,8.20348096 5.47595215,6.73125204 7.1892941,5.14999829 C7.43998101,4.91863781 7.6970489,4.98401742 7.90328336,5.1499983 C8.13346086,5.33524893 8.14477539,5.62950642 7.69478726,6.06607492 C7.24479914,6.50264342 5.74776578,8.01895588 5.74776578,8.01895588 L13.0541565,8.01895588 C13.0541565,8.01895588 15.3861372,8.06299585 15.3861372,11.1263966 C15.3861372,12.0928843 14.8920214,13.862565 13.7807,14.4264192 C13.7244707,14.4549484 13.0215776,14.4440205 13.1444941,13.9808696 C13.2308603,13.6554404 13.7098471,13.3410379 13.9486322,12.8464096 C14.3040707,12.1101413 14.4275512,11.145235 14.3550653,10.5278671 C14.2449871,9.59032173 13.3755455,8.99985177 12.7177973,8.99985177 L5.74776578,8.99985177 C5.74776578,8.99985177 7.62368131,10.8773969 7.90328336,11.1902207 C8.18288541,11.5030444 7.90328336,11.7425888 7.81795621,11.8733032 C7.73262906,12.0040177 7.40609097,12.0718277 7.1892941,11.8733032 Z"></path>
        </g>
    </svg>
);

export default UndoIcon;
