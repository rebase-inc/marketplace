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
                    { !nomination.isFetching && hasMoved ? <UndoApproveTalentIcon nomination={nomination} /> : null }
                </div>
            );
        } else if (auction.bids.some(bid => bid.contractor.id == nomination.contractor.id && bid.contract)) {
            return <div className='approveTalentIcon'><AcceptedTalentIcon /></div>;
        } else {
            return <div className='approveTalentIcon'><RejectedTalentIcon /></div>;
        }
    }
}

export class UndoApproveTalentIcon extends Component {
    render() {
        const { nomination } = this.props;
        return (
            <svg viewBox='0 0 60 32'>
                <g id="UI" transform="translate(30, 11)" stroke="none" strokeWidth="1" fill="none">
                    <g transform='translate(-12.5, -9.5)' stroke="none" fill="none" fill="#CC6070">
                        <path d="M3.76216667,12.5911667 C3.75466667,12.5911667 3.74716667,12.5911667 3.7405,12.5903333 C3.60966667,12.5836667 3.48966667,12.5153333 3.41633333,12.4061667 L0.487166667,8.0445 C0.359666667,7.85366667 0.4105,7.59533333 0.601333333,7.467 C0.792166667,7.337 1.0505,7.38866667 1.17883333,7.58033333 L3.798,11.4811667 L6.80966667,7.87533333 C6.95716667,7.6995 7.21883333,7.6745 7.39633333,7.822 C7.573,7.9695 7.59633333,8.23283333 7.44883333,8.40866667 L4.08216667,12.4411667 C4.003,12.537 3.8855,12.5911667 3.76216667,12.5911667"></path>
                        <path d="M24.552,12.749 C24.4178333,12.749 24.2861667,12.6848333 24.2053333,12.564 L21.5878333,8.664 L18.5753333,12.2706667 C18.427,12.4473333 18.1645,12.4715 17.9878333,12.3231667 C17.8111667,12.1765 17.7878333,11.9131667 17.9353333,11.7365 L21.3045,7.70316667 C21.3886667,7.60233333 21.5153333,7.5315 21.6461667,7.55483333 C21.777,7.56066667 21.897,7.629 21.9703333,7.73816667 L24.8978333,12.1006667 C25.0253333,12.2906667 24.9745,12.5506667 24.7836667,12.6781667 C24.712,12.7265 24.632,12.749 24.552,12.749"></path>
                        <path d="M12.6688333,18.8924167 C10.2446667,18.8924167 7.9005,17.9465833 6.12133333,16.1924167 C5.95716667,16.0299167 5.9555,15.7665833 6.11716667,15.60325 C6.27883333,15.43825 6.54216667,15.4374167 6.70633333,15.59825 C8.8105,17.67325 11.7805,18.5040833 14.6505,17.8265833 C19.008,16.79575 22.0105,12.3340833 21.2055,8.08158333 C21.1621667,7.85575 21.3113333,7.63825 21.5371667,7.59491667 C21.7646667,7.55491667 21.9813333,7.70075 22.0238333,7.92741667 C22.9096667,12.60325 19.6205,17.50825 14.8413333,18.6365833 C14.1188333,18.80825 13.3905,18.8924167 12.6688333,18.8924167"></path>
                        <path d="M3.74958333,12.5358333 C3.56625,12.5358333 3.39791667,12.4141667 3.34791667,12.2275 C2.68958333,9.78166667 3.05541667,7.21583333 4.37625,5.0025 C5.74541667,2.7075 7.99208333,1.04583333 10.5404167,0.443333333 C13.90125,-0.35 17.4070833,0.763333333 19.69625,3.34833333 C19.84875,3.52 19.8320833,3.78333333 19.6604167,3.93583333 C19.4879167,4.08916667 19.2245833,4.07416667 19.0720833,3.9 C16.98625,1.545 13.7895833,0.533333333 10.7320833,1.25416667 C8.40208333,1.805 6.34625,3.32666667 5.09125,5.43 C3.88708333,7.44833333 3.55375,9.785 4.15208333,12.0108333 C4.21208333,12.2333333 4.08041667,12.4616667 3.85791667,12.5208333 C3.82208333,12.5308333 3.78541667,12.5358333 3.74958333,12.5358333"></path>
                    </g>
                    <text y='18' x='0' textAnchor='middle' fill="#CC6070">Undo</text>
                </g>
            </svg>
        );
    }
}


export class ApprovedTalentIcon extends Component {
    render() {
        const { nomination } = this.props;
        return (
            <svg viewBox='0 0 60 32'>
                <g transform="translate(30, 11)" stroke="none" strokeWidth="1" fill="none">
                    <circle cx="0" cy="0" r="10" stroke="none" fill="#25AE90" />
                    <path d="M4.04336,-4.02968 L-0.52224,3.03112 L-3.05304,0.50952" stroke="#F7FAFC" />
                    <text y='18' x='0' textAnchor='middle' fill='#25AE90'>Approve</text>
                </g>
            </svg>
        );
    }
}

export class UnapprovedTalentIcon extends Component {

    render() {
        const { nomination } = this.props;
        let loadingPath = <g className='rotate'><path strokeWidth='2px' d="M0,-10 A 10,10 1 0,1 10,0" stroke="#F5B651"/></g>;
        return (
            <svg viewBox='0 0 60 32'>
                <g transform="translate(30, 11)" stroke="none" strokeWidth="1" fill="none">
                    <circle cx="0" cy="0" r="10" stroke="#BDBFBF" fill="none" />
                    <path d="M4.04336,-4.02968 L-0.52224,3.03112 L-3.05304,0.50952" stroke="#BDBFBF" />
                    { this.props.nomination.isFetching ? loadingPath : null }
                    <text y='18' x='0' textAnchor='middle' fill='#BDBFBF'>Approve</text>
                </g>
            </svg>
        );
    }
}

export class WaitingTalentIcon extends Component {
    render() {
        const { nomination } = this.props;
        return (
            <svg viewBox='0 0 60 32'>
                <g id="UI" transform="translate(30, 11)" stroke="none" strokeWidth="1" fill="none">
                    <circle cx="0" cy="0" r="10" stroke="none" fill="#546C8A" />
                    <path transform='translate(-1.5, -6.5)' d="M6.72416667,10.865 C6.64166667,10.9541667 6.52916667,11 6.41666667,11 C6.31583333,11 6.215,10.9641667 6.135,10.8908333 L1.135,6.3075 C1.04916667,6.22833333 1,6.11666667 1,6 L1,1.41666667 C1,1.18666667 1.18666667,1 1.41666667,1 C1.6475,1 1.83333333,1.18666667 1.83333333,1.41666667 L1.83333333,5.81666667 L6.69833333,10.2758333 C6.86833333,10.4316667 6.88,10.695 6.72416667,10.865" id="Path-Copy-3" stroke="none" fill="#F7FAFC"></path>
                    <text y='18' x='0' textAnchor='middle' fill='#546C8A'>Waiting</text>
                </g>
            </svg>
        );
    }
}

export class RejectedTalentIcon extends Component {
    render() {
        return (
            <svg viewBox='0 0 60 32'>
                <g id="UI" transform="translate(20, 1.5)" stroke="none" strokeWidth="1" fill="#CC6070">
                    <path d="M2.96352,16.1008 L9.45872,9.6048 L2.96352,3.1096 C1.38832,4.82 0.42432,7.1016 0.42432,9.6048 C0.42432,12.108 1.38832,14.3896 2.96352,16.1008"></path>
                    <path d="M10.02464,10.17072 L3.52944,16.66672 C5.23984,18.24112 7.52144,19.20512 10.02464,19.20512 C12.52784,19.20512 14.80944,18.24112 16.51984,16.66672 L10.02464,10.17072 Z"></path>
                    <path d="M10.59032,9.60504 L17.08552,16.10104 C18.66072,14.38984 19.62472,12.10824 19.62472,9.60504 C19.62472,7.10184 18.66072,4.82024 17.08552,3.10984 L10.59032,9.60504 Z"></path>
                    <path d="M10.02464,9.03944 L16.51984,2.54424 C14.80944,0.96904 12.52784,0.00504 10.02464,0.00504 C7.52144,0.00504 5.23984,0.96904 3.52944,2.54424 L10.02464,9.03944 Z"></path>
                    <text y='27.5' x='10' textAnchor='middle' fill='#CC6070'>Not interested</text>
                </g>
            </svg>
        );
    }
}
