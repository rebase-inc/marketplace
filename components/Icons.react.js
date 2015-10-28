import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import d3 from 'd3';

import keymirror from 'keymirror';
import { DonutChart } from '../utils/Graph';

function _dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

var _TalentStates = keymirror({ UNAPPROVED: null, WAITING: null, REJECTED: null, ACCEPTED: null });

export class ApproveTalent extends Component {
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

export class AddTicket extends Component {
    render() {
        // react doesnt yet support the svg mask attribute, so you'll see a mask definition
        // below, as well as an overlay of the same exact element in a light color (that attempts
        // to match the background). If you run across this, it might be worth checking to see if
        // React now supports the mask attribute, at which point you should be able to remove the
        // second g element (id'ed as mask-hack)
        return (
            <svg width="105px" height="30px" viewBox='0 0 105 30' onClick={this.props.onClick}>
                <defs>
                    <mask id="plusMask">
                        <g width='12px' transform='translate(89.0, 4.0)' strokeWidth="1" fill="none">
                            <path d="M11.54174,6.47261538 L11.54174,6.47261538 L6.41564337,6.468 L6.41564337,11.5384615 C6.41564337,11.7941538 6.21034288,12 5.95738335,12 C5.70350729,12 5.49912332,11.7941538 5.49912332,11.5384615 L5.49912332,6.46707692 L0.457346559,6.46153846 C0.204387027,6.46153846 -0.000913463235,6.25476923 3.05680905e-06,6 C3.05680905e-06,5.74523077 0.205303547,5.53846154 0.458263079,5.53846154 L0.458263079,5.53846154 L5.49912332,5.544 L5.49912332,0.461538462 C5.49912332,0.206769231 5.70350729,0 5.95738335,0 C6.21034288,0 6.41564337,0.206769231 6.41564337,0.461538462 L6.41564337,5.54492308 L11.5426565,5.54953846 C11.795616,5.54953846 12,5.75630769 12,6.01107692 C12,6.26584615 11.7946995,6.47261538 11.54174,6.47261538 L11.54174,6.47261538 Z" fill="#F2F6F8"></path>
                        </g>
                    </mask>
                </defs>
                <g strokeWidth="1" fill="#D6DBE3">
                    <circle fill="#C3CAD4" cx="95" cy="10" r="10" mask='url(#plusMask)'></circle>
                </g>
                <g width='12px' transform='translate(89.0, 4.0)' strokeWidth="1" fill="none">
                    <path d="M11.54174,6.47261538 L11.54174,6.47261538 L6.41564337,6.468 L6.41564337,11.5384615 C6.41564337,11.7941538 6.21034288,12 5.95738335,12 C5.70350729,12 5.49912332,11.7941538 5.49912332,11.5384615 L5.49912332,6.46707692 L0.457346559,6.46153846 C0.204387027,6.46153846 -0.000913463235,6.25476923 3.05680905e-06,6 C3.05680905e-06,5.74523077 0.205303547,5.53846154 0.458263079,5.53846154 L0.458263079,5.53846154 L5.49912332,5.544 L5.49912332,0.461538462 C5.49912332,0.206769231 5.70350729,0 5.95738335,0 C6.21034288,0 6.41564337,0.206769231 6.41564337,0.461538462 L6.41564337,5.54492308 L11.5426565,5.54953846 C11.795616,5.54953846 12,5.75630769 12,6.01107692 C12,6.26584615 11.7946995,6.47261538 11.54174,6.47261538 L11.54174,6.47261538 Z" fill="#F2F6F8"></path>
                </g>
                <text fontSize="12px">
                    <tspan x="0" y="15" fill="#C3CAD4">ADD TICKET</tspan>
                </text>
            </svg>
        );
    }
};

export class Timer extends Component {
    static propTypes = { expires: React.PropTypes.string.isRequired }
    constructor(props, context) {
        super(props, context);
        this.state = { currentDateTime: new Date() };
        this._timer = setInterval(() => this.setState({currentDateTime : new Date()}), 2000);
        this.componentWillUnmount = this.componentWillUnmount.bind(this);
    }
    componentWillUnmount() {
        clearInterval(this._timer);
    }
    render() {
        let expires = new Date(this.props.expires);
        let minutesRemaining = Math.max(0, (expires - this.state.currentDateTime) / (1000*60));
        let wholeDaysRemaining = Math.floor(minutesRemaining / (60*24));
        let wholeHoursRemaining = Math.floor((minutesRemaining % (60*24)) / 60);
        let wholeMinutesRemaining = Math.floor(minutesRemaining % 60);
        wholeDaysRemaining = (wholeDaysRemaining < 10) ? '0' + wholeDaysRemaining : wholeDaysRemaining;
        wholeHoursRemaining = (wholeHoursRemaining < 10) ? '0' + wholeHoursRemaining : wholeHoursRemaining;
        wholeMinutesRemaining = (wholeMinutesRemaining < 10) ? '0' + wholeMinutesRemaining : wholeMinutesRemaining;
        return (
            <svg width="92px" height="24px">
                <g stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                    <g fill="#2C4568">
                        <g transform="translate(2.0, 12.0)">
                            <g>
                                <text opacity="0.5" fontSize="8">
                                    <tspan x="12" y="12" textAnchor='middle'>DAYS</tspan>
                                </text>
                                <text fontSize="18">
                                    <tspan x="12" y="3" textAnchor='middle'>{wholeDaysRemaining}</tspan>
                                </text>
                            </g>
                            <g transform="translate(16.5, 0.0)">
                                <text fontSize="18" opacity='0.5'>
                                    <tspan x="12" y="2" textAnchor='middle'>:</tspan>
                                </text>
                            </g>
                            <g transform="translate(33.0, 0.0)">
                                <text opacity="0.5" fontSize="8">
                                    <tspan x="12" y="12" textAnchor='middle'>HRS</tspan>
                                </text>
                                <text fontSize="18">
                                    <tspan x="12" y="3" textAnchor='middle'>{wholeHoursRemaining}</tspan>
                                </text>
                            </g>
                            <g transform="translate(49.5, 0.0)">
                                <text fontSize="18" opacity='0.5'>
                                    <tspan x="12" y="2" textAnchor='middle'>:</tspan>
                                </text>
                            </g>
                            <g transform="translate(66.000000, 0.000000)">
                                <text opacity="0.5" fontSize="8">
                                    <tspan x="12" y="12" textAnchor='middle'>MINS</tspan>
                                </text>
                                <text id="32" fontSize="18">
                                    <tspan x="12" y="3" textAnchor='middle'>{wholeMinutesRemaining}</tspan>
                                </text>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
};

var Checkbox = React.createClass({
    propTypes: {
        checked: React.PropTypes.bool.isRequired,
        toggle: React.PropTypes.func,
        label: React.PropTypes.string,
    },
    getDefaultProps: () => ({ label: '' }),
    getInitialState: () => ({ width: 20 }),
    componentDidMount: function() {
        // After mounting, resize the svg to fit the label, if there is one
        // This will be 20px (checkbox) + 4px (margin) + label witdth
        let node = ReactDOM.findDOMNode(this.refs.label);
        if (!!node) {
            this.setState({ width: 24 + node.offsetWidth });
        }
    },
    render: function() {
        return (
            <svg className='checkbox' height='20px' width={this.state.width + 'px'} onClick={this.props.toggle || null} style={this.props.style}>
                <g>
                    <rect fill={this.props.checked ? '#40B89E' : '#E4E6E8'} x="0" y="0" width="20" height="20" rx="4"/>
                    <path fill={this.props.checked ? '#F5F7FA' : 'none'} transform='translate(5, 3.5)' d="M9.76178274,2.52444 L8.40761607,0.747516923 C8.33216964,0.648516923 8.20952083,0.648516923 8.1340744,0.747516923 L3.43472917,6.91394769 L2.21713988,5.31674769 C2.14169345,5.21774769 2.01904464,5.21774769 1.94359821,5.31674769 L0.589431548,7.09367077 C0.513985119,7.19267077 0.513985119,7.35360923 0.589431548,7.45260923 L3.29776488,11.0064554 C3.33568155,11.0562092 3.38520536,11.0810862 3.43472917,11.0810862 C3.48425298,11.0810862 3.53338988,11.0562092 3.57130655,11.0064554 L9.76178274,2.88337846 C9.83722917,2.78437846 9.83722917,2.62344 9.76178274,2.52444"/>
                </g>
                { !!this.props.label.length ? <text ref='label' x='24' y='20' dy='-4'>{this.props.label}</text> : null }
            </svg>
        );
    }
});

export class ProfilePicture extends Component {
    static propTypes = { user: React.PropTypes.object, dynamic: React.PropTypes.bool };
    static defaultProps = { dynamic: false };

    openFileDialog() {
        if (!this.props.dynamic) { return; }
        let fileInput = ReactDOM.findDOMNode(this.refs.fileInput);
        fileInput.value = null;
        fileInput.click();
    }

    handleFile(event) {
        let MAX_DIMENSION = 600;
        let fileToUpload = event.target.files[0];

        let img = document.createElement('img');
        img.src = window.URL.createObjectURL(fileToUpload);
        let canvas = document.createElement('canvas');
        canvas.height = MAX_DIMENSION;
        canvas.width = MAX_DIMENSION;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        img.onload = () => {
            let size = Math.min(img.width, img.height);
            let sourceX = (img.width - size)/2;
            let sourceY = (img.height - size)/2;
            ctx.drawImage(img, sourceX, sourceY, size, size, 0, 0, MAX_DIMENSION, MAX_DIMENSION);
            let imgUrl = canvas.toDataURL('image/jpeg');
            this.setState({ photo: imgUrl });
            UserActions.updateProfilePhoto(_dataURItoBlob(imgUrl));
        }
    }

    render() {
        const { user, dynamic } = this.props;
        if (!!user.photo) {
            return (
                <div>
                    <img ref='imgNode' className='profilePicture' onClick={this.openFileDialog} src={user.photo}/>
                    { !!dynamic ? <h5 onClick={this.openFileDialog}>Change profile picture</h5> : null }
                    <input type='file' ref='fileInput' style={{ display: 'none' }} onChange={this.handleFile} />
                </div>
            );
        }
        else {
            let initials = user.first_name.charAt(0) + user.last_name.charAt(0);
            return (
                <div>
                    <svg onClick={this.openFileDialog} className='profilePicture' width="140px" height="140px" viewBox="0 0 140 140" version="1.1">
                        <g id="UI" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                            <circle id="Oval-276" fill="#718296" cx="70" cy="70" r="70"></circle>
                            <text id="intials" x='70' y='70' fontFamily="Gotham Rounded" fontSize="54px" dy="18px" fill="#F5F7FA" textAnchor='middle'>
                                {initials}
                            </text>
                        </g>
                    </svg>
                    {!!dynamic ? <h5>Change profile picture</h5> : null }
                    <input type='file' ref='fileInput' style={{ display: 'none' }} onChange={this.handleFile} />
                </div>
            );
        }
    }
}


export class TalentScore extends Component {
    static propTypes = { score: React.PropTypes.number.isRequired, }

    render() {
        let bgColor;
        let text;

        const { score } = this.props;

        // TODO: refactor this if else
        if ( score >= 0.97 ) { bgColor = '#25AE90'; text = 'perfect match'; }
        else if ( score >= 0.90 ) { bgColor = '#25AE90'; text = 'great match'; }
        else if ( score >= 0.75 ) { bgColor = '#25AE90'; text = 'good match'; }
        else if ( score >= 0.5 ) { bgColor = '#F5B651'; text = 'okay match'; }
        else { bgColor = '#CC6070'; text = 'poor match'; }

        return (
            <div className='talentScore' style={{backgroundColor: bgColor}}>
                <span className='score'>{ Math.round(100*this.props.score) + '%' }</span>
                <span className='text'>{text}</span>
            </div>
        );
    }
};

export class FindTalent extends Component {
    render() {
        return (
            <svg width="25px" height="22px" viewBox="0 0 25 22" version="1.1">
                <g id="UI" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                    <g id="Mgr-New-Tickets" transform="translate(-44.000000, -321.000000)" fill="#DFE0E1">
                        <g id="Manager-Sidebar" transform="translate(0.000000, -1.000000)">
                            <g id="cogs3-+-IN-PROGRESS" transform="translate(44.000000, 319.000000)">
                                <g id="Group" transform="translate(0.000000, 3.000000)">
                                    <path d="M0.5308,10.5071 C0.5308,11.5901 0.8668,12.2371 1.5308,12.4391 L1.5308,16.5071 L5.5308,16.5071 L5.5308,12.4381 C6.1938,12.2361 6.5298,11.5901 6.5308,10.5071 L6.5308,7.0071 L0.5308,7.0071 L0.5308,10.5071 Z" id="Fill-4433"></path>
                                    <path d="M18.5308,7.0071 L18.5308,10.5071 C18.5308,11.5901 18.8668,12.2371 19.5308,12.4391 L19.5308,16.5071 L23.5308,16.5071 L23.5308,12.4381 C24.1938,12.2361 24.5298,11.5901 24.5308,10.5071 L24.5308,7.0071 L18.5308,7.0071 Z" id="Fill-4434"></path>
                                    <path d="M8.5308,12.5071 C8.5308,13.7141 9.3908,14.7251 10.5308,14.9571 L10.5308,21.0071 L14.5308,21.0071 L14.5308,14.9571 C15.6708,14.7251 16.5308,13.7141 16.5308,12.5071 L16.5308,7.0071 L8.5308,7.0071 L8.5308,12.5071 Z" id="Fill-4435"></path>
                                    <path d="M21.5308,6.0071 C22.6338,6.0071 23.5308,5.1101 23.5308,4.0071 C23.5308,2.9041 22.6338,2.0071 21.5308,2.0071 C20.4278,2.0071 19.5308,2.9041 19.5308,4.0071 C19.5308,5.1101 20.4278,6.0071 21.5308,6.0071" id="Fill-4436"></path>
                                    <path d="M3.5308,6.0071 C4.6338,6.0071 5.5308,5.1101 5.5308,4.0071 C5.5308,2.9041 4.6338,2.0071 3.5308,2.0071 C2.4278,2.0071 1.5308,2.9041 1.5308,4.0071 C1.5308,5.1101 2.4278,6.0071 3.5308,6.0071" id="Fill-4437"></path>
                                    <path d="M12.5308,6.0071 C14.1848,6.0071 15.5308,4.6611 15.5308,3.0071 C15.5308,1.3531 14.1848,0.0071 12.5308,0.0071 C10.8768,0.0071 9.5308,1.3531 9.5308,3.0071 C9.5308,4.6611 10.8768,6.0071 12.5308,6.0071" id="Fill-4438"></path>
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
};

export class Comment extends Component {
    render() {
        return (
            <svg className='commentIcon' width="25px" height="24px" viewBox="0 0 25 24">
                <g stroke="none" strokeWidth="1" fill="#CBD0D4">
                    <path d="M17.0308,9.0068 C17.5068,9.0068 17.9728,9.0518 18.4298,9.1218 C18.4948,8.7428 18.5308,8.3498 18.5308,7.9418 C18.5308,3.8418 14.4938,0.5068 9.5308,0.5068 C4.5678,0.5068 0.5308,3.8418 0.5308,7.9418 C0.5308,9.9028 1.3858,11.7678 2.8908,13.1188 L1.0968,16.2588 C0.9908,16.4438 1.0138,16.6738 1.1538,16.8348 C1.2508,16.9458 1.3888,17.0068 1.5308,17.0068 C1.5928,17.0068 1.6568,16.9948 1.7168,16.9708 L6.5558,15.0348 C6.9908,15.1588 7.4428,15.2528 7.9028,15.3158 C7.9258,15.3188 7.9678,15.3118 7.9788,15.3198 C8.0538,15.3198 8.2978,15.3178 8.6568,15.2978 C9.3358,11.7838 12.8898,9.0068 17.0308,9.0068" id="Fill-1121"></path>
                    <path d="M17.0308,10.0068 C12.9658,10.0068 9.5308,12.9838 9.5308,16.5068 C9.5308,19.8628 12.4088,22.7308 15.9648,23.0798 C15.9668,23.0798 15.9688,23.0798 15.9708,23.0808 C16.1198,23.0948 16.2728,23.0968 16.4248,23.1028 C16.5138,23.1058 16.6008,23.1148 16.6908,23.1148 L16.7068,23.1148 C16.9378,23.1138 17.1678,23.1028 17.3968,23.0808 C17.4808,23.0728 17.5638,23.0568 17.6478,23.0458 C17.7978,23.0268 17.9468,23.0078 18.0948,22.9788 C18.1898,22.9608 18.2838,22.9348 18.3788,22.9128 C18.5138,22.8808 18.6498,22.8498 18.7838,22.8108 C18.8798,22.7818 18.9748,22.7468 19.0708,22.7148 C19.2288,22.6608 19.3878,22.6098 19.5428,22.5458 L19.7238,22.6128 L23.3558,23.9748 C23.4128,23.9968 23.4718,24.0068 23.5308,24.0068 C23.6698,24.0068 23.8058,23.9488 23.9028,23.8408 C24.0398,23.6888 24.0698,23.4668 23.9778,23.2838 L22.8188,20.9648 L22.6528,20.6338 C22.7788,20.5208 22.8938,20.4018 23.0078,20.2818 C23.0618,20.2258 23.1138,20.1678 23.1648,20.1098 C23.2478,20.0138 23.3288,19.9178 23.4048,19.8188 C23.4398,19.7738 23.4748,19.7278 23.5078,19.6818 C23.5948,19.5618 23.6768,19.4398 23.7518,19.3148 C23.7698,19.2848 23.7888,19.2558 23.8058,19.2258 C23.8898,19.0818 23.9668,18.9348 24.0368,18.7848 C24.0438,18.7688 24.0518,18.7528 24.0598,18.7368 C24.1318,18.5758 24.1968,18.4108 24.2528,18.2438 C24.2558,18.2338 24.2598,18.2238 24.2628,18.2138 C24.3178,18.0468 24.3638,17.8758 24.4018,17.7018 C24.4048,17.6878 24.4088,17.6748 24.4118,17.6608 C24.4468,17.4968 24.4718,17.3288 24.4908,17.1588 C24.4938,17.1348 24.4988,17.1118 24.5008,17.0878 C24.5208,16.8968 24.5308,16.7028 24.5308,16.5068 C24.5308,12.9838 21.0958,10.0068 17.0308,10.0068" id="Fill-1122"></path>
                </g>
            </svg>
        );
    }
};

export class Dropback extends Component {
    render() {
        // the transforms on the g element look like a nightmare...TODO: fix it
        return (
            <svg className='dropbackIcon' width="14px" height="24px" viewBox="0 0 14 23" version="1.1">
                <g id="angle1-copy-3" transform="translate(6.500000, 11.727273) rotate(90.000000) translate(-6.500000, -11.727273) translate(-5.000000, 4.727273)" fill="#2F4B6B">
                    <path d="M21.874649,1.48404626 L20.7743234,0.34128673 C20.6276314,0.188656928 20.4587869,0.112622596 20.2677901,0.112622596 C20.0773335,0.112622596 19.9084891,0.188656928 19.761797,0.34128673 L11.1115578,9.32484123 L2.46158875,0.3415673 C2.31489669,0.188937497 2.14605223,0.112903166 1.95532553,0.112903166 C1.76459884,0.112903166 1.59575438,0.188937497 1.44906231,0.3415673 L0.34873676,1.48432683 C0.201774545,1.63667607 0.128563589,1.812032 0.128563589,2.01011406 C0.128563589,2.20819612 0.202044696,2.38355205 0.34873676,2.53590128 L10.6052946,13.1882831 C10.7519866,13.3406323 10.9208311,13.4166667 11.1115578,13.4166667 C11.3022845,13.4166667 11.4708588,13.3406323 11.6175509,13.1882831 L21.874649,2.53590128 C22.0213411,2.38355205 22.0942819,2.20819612 22.0942819,2.01011406 C22.0942819,1.812032 22.0213411,1.63667607 21.874649,1.48404626 L21.874649,1.48404626 Z" id="Shape"></path>
                </g>
            </svg>
        );
    }
};

var AddNewProject = React.createClass({
    render: function() {
        return (
            <div onClick={this.props.onClick} className='addNewProject icon'>
                <h5>Add New Project</h5>
                <svg width="25px" height="25px" viewBox="0 0 25 25" version="1.1">
                    <g id="UI" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                        <g fill="#D5DBE3">
                            <path d="M24.0386,8.0295 L16.5386,8.0155 L16.5526,0.5155 C16.5536,0.3825 16.5006,0.2555 16.4066,0.1615 C16.3136,0.0675 16.1856,0.0145 16.0536,0.0145 L9.0316,0.0075 L9.0306,0.0075 C8.8986,0.0075 8.7716,0.0605 8.6776,0.1545 C8.5836,0.2475 8.5306,0.3745 8.5306,0.5075 L8.5306,8.0075 L1.0306,8.0075 C0.7546,8.0075 0.5306,8.2315 0.5306,8.5075 L0.5306,15.5075 C0.5306,15.7845 0.7546,16.0075 1.0306,16.0075 L8.5306,16.0075 L8.5306,23.5075 C8.5306,23.7845 8.7546,24.0075 9.0306,24.0075 L16.0306,24.0075 C16.3066,24.0075 16.5306,23.7845 16.5306,23.5075 L16.5306,16.0075 L24.0306,16.0075 C24.3066,16.0075 24.5306,15.7845 24.5306,15.5085 L24.5376,8.5305 C24.5376,8.2545 24.3146,8.0305 24.0386,8.0295"></path>
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
});

export class FindTalentOverview extends Component {
    static propTypes = {
        auction: React.PropTypes.object.isRequired,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        margin: React.PropTypes.number,
    }
    static defaultProps = { width: 160, height: 60, margin: 6 }

    constructor(props, context) {
        super(props, context);
        this.componentDidMount = this.componentDidMount.bind(this);
    }

    componentDidMount() {
        const { auction } = this.props;
        let element = ReactDOM.findDOMNode(this);
        let data = [
            {category: 'nominated', population: auction.ticket_set.nominations.filter(n => !n.auction).length, color: '#507196'},
            {category: 'offered', population: auction.approved_talents.length - auction.bids.filter(b => !b.contract).length, color: '#CBD0D4'},
            {category: 'rejected', population: auction.bids.filter(b => !b.contract).length, color: '#CC6070'}
        ];
        new DonutChart(element, this.props, data);
    }
    render() {
        return <div className='findTalentOverview'/>;
    }
};

var ProjectGraph = React.createClass({
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
    },
    getDefaultProps: function() {
        return { width: 160, height: 50, margin: 18 }
    },
    getInitialState: function() {
        return { displayText: '' }
    },
    componentDidMount: function() {
        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        var openTickets = [0, 0, 0, 0, 0].map(e => getRandomInt(0, 12)); //horrible hack
        var closedTickets = [0, 0, 0, 0, 0].map(e => getRandomInt(3, 11));//horrible hack
        var element = ReactDOM.findDOMNode(this);
        Graph.lineChart.create(element, this.props, {openTickets: openTickets, closedTickets: closedTickets});
    },
    render: function() {
        return (
            <div className='projectGraph'>
                <div className='graphLabels'>
                    <span className='openTickets'>Offered</span>
                    <span className='closedTickets'>Completed</span>
                </div>
            </div>
        );
    }
});

export class Logo extends Component {
    render() {
        return (
            <svg width="59px" height="49px" viewBox="0 0 59 49">
                <g stroke="none" strokeWidth="1" fill="none">
                    <path d="M39.4328849,0.332707025 L39.4328849,14.0498069 L19.9125,25.9848489 L19.9125,11.8787876 L39.4328849,0.332707025 Z" fill="#8499B1"></path>
                    <path d="M19.9125,11.8787879 L19.9125,25.9848485 L0,38.0924593 L0,24.3753594 L19.9125,11.8787879 Z" fill="#8499B1"></path>
                    <path d="M39.0875,37.1212121 L39.0875,23.7575765 L19.9125,11.8787868 L19.9585938,25.4726274 L39.0875,37.1212121 Z" fill="#A1BAD6"></path>
                    <path d="M39.4328849,0.332707025 L39.4328849,14.0498069 L59,25.9848489 L59,11.8787876 L39.4328849,0.332707025 Z" fill="#8499B1"></path>
                    <path d="M59,11.8787868 C59,11.8787868 39.0874996,22.960683 39.0874996,23.0151504 L39.0874996,37.1212121 L58.9999996,25.2424228" fill="#A1BAD6"></path>
                    <path d="M58.7421396,49 L58.7421396,35.2829001 L39.0875,23.7575758 L39.0875,37.1212118 L58.7421396,49 Z" fill="#A1BAD6"></path>
                </g>
            </svg>
        );
    }
};

export class Dropdown extends Component {
    render() {
        return (
            <svg className='dropdownIcon' width="16px" height="10px" viewBox="0 0 22 14">
                <g stroke="none" strokeWidth="1" fill="white" fill-rule="evenodd">
                    <path d="M21.84644,2.34671111 L19.57428,0.625488889 C19.39036,0.485488889 19.11228,0.504933333 18.95388,0.667488889 L11.43868,8.41493333 L3.92612,0.667488889 C3.85044,0.588933333 3.7422,0.540711111 3.62604,0.532933333 C3.509,0.524377778 3.3946,0.5586 3.30572,0.625488889 L1.03356,2.34671111 C0.84876,2.48671111 0.82764,2.73171111 0.98604,2.89504444 L11.10428,13.3304889 C11.18788,13.4168222 11.3102,13.4666 11.43868,13.4666 C11.56716,13.4666 11.68948,13.4168222 11.77308,13.3304889 L21.89396,2.89504444 C21.96964,2.81648889 22.00748,2.7146 21.99868,2.61193333 C21.98988,2.50926667 21.93532,2.4136 21.84644,2.34671111"></path>
                </g>
            </svg>
        );
    }
};


//module.exports = {
    //Dropdown: Dropdown,
    //Comment: Comment,
    //FindTalent: FindTalent,
    //Dropback: Dropback,
    //ApproveTalent: ApproveTalent,
    //TalentScore: TalentScore,
    //AddNewProject: AddNewProject,
    //ProjectGraph: ProjectGraph,
    //FindTalentOverview: FindTalentOverview,
    //Timer: Timer,
    //AddTicket: AddTicket,
    //Checkbox: Checkbox,
//};
