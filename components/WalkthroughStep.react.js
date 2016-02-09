import React from 'react';

const WalkthroughStep = (props) => (
    <div className='walkthroughStep'>
        <h3>{props.title}</h3>
        <h4>{props.description}</h4>
        <div className='buttons'>
        { props.first ? null : <button data-quiet onClick={props.previousStep}>Back</button> }
            <button data-notification onClick={props.exit}>Exit</button>
        { props.last ? null : <button data-okay onClick={props.nextStep}>Next</button> }
        { props.extra ? <button data-okay onClick={props.extra.fn}>{props.extra.name}</button> : null }
        </div>
    </div>
);

export default WalkthroughStep;
