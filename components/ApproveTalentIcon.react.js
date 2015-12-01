import React, { Component, PropTypes } from 'react';

import keymirror from 'keymirror';

var _TalentStates = keymirror({ UNAPPROVED: null, WAITING: null, REJECTED: null, ACCEPTED: null });

export default class ApproveTalentIcon extends Component {
    static propTypes = {
        nomination: React.PropTypes.object.isRequired,
    }

    constructor(props, context) {
        super(props, context);
        // hasMoved is used so that we only display the preview state once the user has moved the mouse
        // in order to make sure they don't see the preview state before interacting with the UI
        this.state = { hasMoved: false };
        this.componentWillUpdate = this.componentWillUpdate.bind(this);
    }

    componentWillUpdate(nextProps) {
        if (nextProps != this.props) {
            this.setState({ hasMoved: false });
        }
    }

    render() {
        const { nomination, auction, approve } = this.props;
        const { hasMoved } = this.state;
        // The blocks below display two icons at once and rely on css to display one and hide the
        // other. We do this because managing hover state in javascript is too slow
        if (auction.approved_talents.every(t => t.contractor.id != nomination.contractor.id)) {
            return (
                <div className='approveTalentIcon' onMouseMove={() => this.setState({ hasMoved : true })} onClick={approve}>
                    <UnapprovedTalentIcon nomination={nomination} />
                    { !nomination.isFetching && hasMoved ? <ApprovedTalentIcon nomination={nomination} /> : null }
                </div>
            );
        } else if (auction.bids.every(bid => bid.contractor.id != nomination.contractor.id)) {
            return (
                <div className='approveTalentIcon' onMouseMove={() => this.setState({ hasMoved: true })}>
                    <WaitingTalentIcon nomination={nomination} />
                    { !nomination.isFetching && hasMoved ? <UnapprovedTalentIcon nomination={nomination} /> : null }
                </div>
            );
        } else if (auction.bids.some(bid => bid.contractor.id == nomination.contractor.id && bid.contract)) {
            return <div className='approveTalentIcon'><AcceptedTalentIcon /></div>;
        } else {
            return <div className='approveTalentIcon'><RejectedTalentIcon /></div>;
        }
    }
}

export class ApprovedTalentIcon extends Component {
    render() {
        const { nomination } = this.props;
        return (
            <svg width="20px" height="28px" x='0px' y='0px'>
                <g id="UI" transform="translate(10, 2)" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                    <circle cx="0" cy="0" r="10" stroke="none" fill="#25AE90" />
                    <path d="M4.04336,-4.02968 L-0.52224,3.03112 L-3.05304,0.50952" stroke="#F7FAFC" />
                </g>
                <text y='21' x='10' textAnchor='middle' fill="#25AE90">Approve</text>
            </svg>
        );
    }
}

export class UnapprovedTalentIcon extends Component {

    render() {
        const { nomination } = this.props;
        let loadingPath = <g className='rotate'><path strokeWidth='2px' d="M0,-10 A 10,10 1 0,1 10,0" stroke="#F5B651"/></g>;
        return (
            <svg width="20px" height="28px" x='0px' y='0px'>
                <g id="UI" transform="translate(10, 2)" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                    <circle cx="0" cy="0" r="10" stroke="#BDBFBF" fill="none" />
                    <path d="M4.04336,-4.02968 L-0.52224,3.03112 L-3.05304,0.50952" stroke="#BDBFBF" />
                    { this.props.nomination.isFetching ? loadingPath : null }
                </g>
                <text y='21' x='10' textAnchor='middle' fill='#BDBFBF'>Approve</text>
            </svg>
        );
    }
}

export class WaitingTalentIcon extends Component {
    render() {
        const { nomination } = this.props;
        return (
            <svg width="20px" height="28px">
                <g id="UI" transform="translate(10, 2)" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                    <circle cx="0" cy="0" r="10" stroke="none" fill="#F5B651" />
                    <path transform='translate(-1.5, -6.5)' d="M6.72416667,10.865 C6.64166667,10.9541667 6.52916667,11 6.41666667,11 C6.31583333,11 6.215,10.9641667 6.135,10.8908333 L1.135,6.3075 C1.04916667,6.22833333 1,6.11666667 1,6 L1,1.41666667 C1,1.18666667 1.18666667,1 1.41666667,1 C1.6475,1 1.83333333,1.18666667 1.83333333,1.41666667 L1.83333333,5.81666667 L6.69833333,10.2758333 C6.86833333,10.4316667 6.88,10.695 6.72416667,10.865" id="Path-Copy-3" stroke="none" fill="#F7FAFC"></path>
                </g>
                <text y='21' x='10' textAnchor='middle' fill='#F5B651'>Waiting</text>
            </svg>
        );
    }
}

export class RejectedTalentIcon extends Component {
    render() {
        return (
            <svg width="25px" height="24px" viewBox="0 0 25 24">
                <g stroke="none" strokeWidth="1" fill="#CC6070">
                    <path d="M3.7044,20.126 L11.8234,12.006 L3.7044,3.887 C1.7354,6.025 0.5304,8.877 0.5304,12.006 C0.5304,15.135 1.7354,17.987 3.7044,20.126"></path>
                    <path d="M12.5308,12.7134 L4.4118,20.8334 C6.5498,22.8014 9.4018,24.0064 12.5308,24.0064 C15.6598,24.0064 18.5118,22.8014 20.6498,20.8334 L12.5308,12.7134 Z"></path>
                    <path d="M13.2379,12.0063 L21.3569,20.1263 C23.3259,17.9873 24.5309,15.1353 24.5309,12.0063 C24.5309,8.8773 23.3259,6.0253 21.3569,3.8873 L13.2379,12.0063 Z"></path>
                    <path d="M12.5308,11.2993 L20.6498,3.1803 C18.5118,1.2113 15.6598,0.0063 12.5308,0.0063 C9.4018,0.0063 6.5498,1.2113 4.4118,3.1803 L12.5308,11.2993 Z"></path>
                </g>
                <text fill='#CC6070'>Rejected</text>
            </svg>
        );
    }
}
