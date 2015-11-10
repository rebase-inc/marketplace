import React, { Component, PropTypes } from 'react';

import keymirror from 'keymirror';

var _TalentStates = keymirror({ UNAPPROVED: null, WAITING: null, REJECTED: null, ACCEPTED: null });

export default class ApproveTalentIcon extends Component {
    static propTypes = { nomination: React.PropTypes.object.isRequired }

    constructor(props, context) {
        super(props, context);
        this._getNominationState = this._getNominationState.bind(this);
    }
    _getNominationState() {
        const { nomination, auction} = this.props;
        if (auction.approved_talents.every(t => t.contractor.id != nomination.contractor.id)) {
            return _TalentStates.UNAPPROVED;
        } else if (auction.bids.every(bid => bid.contractor.id != nomination.contractor.id)) {
            return _TalentStates.WAITING;
        } else if (auction.bids.some(bid => bid.contractor.id == nomination.contractor.id && bid.contract)) {
            return _TalentStates.ACCEPTED;
        } else {
            return _TalentStates.REJECTED;
        }
    }

    render() {
        // TODO: Abstract out the svgs nested in this component
        switch (this._getNominationState()) {
            case _TalentStates.UNAPPROVED:
                let loadingPath = !!this.props.nomination.isFetching ? (
                    <g className='rotate'>
                        <path strokeWidth='2px' d="M0,-10 A 10,10 1 0,1 10,0" stroke="#F5B651"/>
                    </g>
                    ) : null;
                return (
                    <div>
                        <svg width="20px" height="20px" x='0px' y='0px'>
                            <g id="UI" transform="translate(10, 10)" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                                <path d="M4.04336,-4.02968 L-0.52224,3.03112 L-3.05304,0.50952" stroke="#BDBFBF"></path>
                                <circle cx="0" cy="0" r="10" stroke="#BDBFBF"/>
                                { loadingPath }
                            </g>
                        </svg>
                        <span>Approve</span>
                    </div>
                );
                break;
            case _TalentStates.WAITING:
                return (
                    <div>
                        <svg width="25px" height="24px" viewBox="0 0 25 24">
                            <g id="UI" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                                <g transform="translate(-364.000000, -189.000000)" fill="#F5B651">
                                    <g id="Rectangle-349-+-Approved-+-Fill-2197" transform="translate(349.000000, 184.000000)">
                                        <g id="Fill-2412" transform="translate(15.000000, 5.000000)">
                                            <path d="M18.3994,17.8457 C18.3004,17.9527 18.1654,18.0077 18.0304,18.0077 C17.9094,18.0077 17.7884,17.9647 17.6924,17.8767 L11.6924,12.3767 C11.5894,12.2817 11.5304,12.1477 11.5304,12.0077 L11.5304,6.5077 C11.5304,6.2317 11.7544,6.0077 12.0304,6.0077 C12.3074,6.0077 12.5304,6.2317 12.5304,6.5077 L12.5304,11.7877 L18.3684,17.1387 C18.5724,17.3257 18.5864,17.6417 18.3994,17.8457 M12.5304,0.0077 C5.9144,0.0077 0.5304,5.3907 0.5304,12.0077 C0.5304,18.6247 5.9144,24.0077 12.5304,24.0077 C19.1474,24.0077 24.5304,18.6247 24.5304,12.0077 C24.5304,5.3907 19.1474,0.0077 12.5304,0.0077"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        <span style={{color: '#F5B651'}}>Waiting</span>
                    </div>
                );
                break;
            case _TalentStates.REJECTED:
                return (
                    <div>
                        <svg width="25px" height="24px" viewBox="0 0 25 24" version="1.1">
                            <g id="UI" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                                <g id="Mgr-Waiting-for-Dev-Response" transform="translate(-364.000000, -320.000000)" fill="#CC6070">
                                    <g id="Rectangle-349-+-Approved-+-Fill-2197-Copy" transform="translate(349.000000, 315.000000)">
                                        <g id="Group" transform="translate(15.000000, 5.000000)">
                                            <path d="M3.7044,20.126 L11.8234,12.006 L3.7044,3.887 C1.7354,6.025 0.5304,8.877 0.5304,12.006 C0.5304,15.135 1.7354,17.987 3.7044,20.126" id="Fill-712"></path>
                                            <path d="M12.5308,12.7134 L4.4118,20.8334 C6.5498,22.8014 9.4018,24.0064 12.5308,24.0064 C15.6598,24.0064 18.5118,22.8014 20.6498,20.8334 L12.5308,12.7134 Z" id="Fill-713"></path>
                                            <path d="M13.2379,12.0063 L21.3569,20.1263 C23.3259,17.9873 24.5309,15.1353 24.5309,12.0063 C24.5309,8.8773 23.3259,6.0253 21.3569,3.8873 L13.2379,12.0063 Z" id="Fill-714"></path>
                                            <path d="M12.5308,11.2993 L20.6498,3.1803 C18.5118,1.2113 15.6598,0.0063 12.5308,0.0063 C9.4018,0.0063 6.5498,1.2113 4.4118,3.1803 L12.5308,11.2993 Z" id="Fill-715"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        <span style={{color: '#CC6070'}}>Rejected</span>
                    </div>
                );
                break;
            default: throw 'invalid state'; break;
        }
    }
};

