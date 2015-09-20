var React = require('react');
var ReactDOM = require('react-dom');
var TalentActions = require('../actions/TalentActions');
var UserActions = require('../actions/UserActions');
var Graph = require('../utils/Graph');

function _dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

var ApproveTalent = React.createClass({
    propTypes: {
        approved: React.PropTypes.string,
    },
    getDefaultProps: function() {
        return { state: 'unapproved' };
    },
    _getNominationState: function(nomination) {
        if (!!nomination.auction) {
            return 'waiting';
        } else {
            return 'unapproved';
        }
    },
    render: function() {
        switch (this._getNominationState(this.props.nomination)) {
            case 'unapproved':
                return (
                    <div>
                        <svg width="26px" height="26px" viewBox="0 0 26 26" onClick={TalentActions.approveNomination.bind(null, this.props.nomination)}>
                            <g id="UI" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Mgr-Suggested-Devs" transform="translate(-363.000000, -188.000000)" stroke-linecap="round" stroke="#BDBFBF" stroke-linejoin="round">
                                    <g id="Long-Ticket-Copy-2" transform="translate(325.000000, 141.000000)">
                                        <g id="Stroke-1494-+-Stroke-1495" transform="translate(39.000000, 48.000000)">
                                            <path d="M17.04336,8.47032 L9.47776,15.53112 L6.95696,13.00952" id="Stroke-1494"></path>
                                            <path d="M23.6,12.0016 C23.6,18.408 18.4048,23.6016 12,23.6016 C5.592,23.6016 0.4,18.408 0.4,12.0016 C0.4,5.5936 5.592,0.4016 12,0.4016 C18.4048,0.4016 23.6,5.5936 23.6,12.0016 L23.6,12.0016 Z" id="Stroke-1495"></path>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </svg>
                        <span>Approve</span>
                    </div>
                );
                break;
            case 'waiting':
                return (
                    <div>
                        <svg width="25px" height="24px" viewBox="0 0 25 24">
                            <g id="UI" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                                <g id="Mgr-Waiting-for-Dev-Response" transform="translate(-364.000000, -189.000000)" fill="#F5B651">
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
            case 'rejected':
                return (
                    <div>
                        <svg width="25px" height="24px" viewBox="0 0 25 24" version="1.1">
                            <g id="UI" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
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
});

var ProfilePicture = React.createClass({
    propTypes: {
        user: React.PropTypes.object,
        dynamic: React.PropTypes.bool,
    },
    getDefaultProps: function() {
        return { dynamic: false };
    },
    openFileDialog: function() {
        if (this.props.dynamic) {
            var fileInput = ReactDOM.findDOMNode(this.refs.fileInput);
            fileInput.value = null;
            fileInput.click();
        }
    },
    handleFile: function(event) {
        var MAX_DIMENSION = 600;
        var fileToUpload = event.target.files[0];

        var img = document.createElement('img');
        img.src = window.URL.createObjectURL(fileToUpload);
        var canvas = document.createElement('canvas');
        canvas.height = MAX_DIMENSION;
        canvas.width = MAX_DIMENSION;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        img.onload = function() {
            var size = Math.min(img.width, img.height);
            var sourceX = (img.width - size)/2;
            var sourceY = (img.height - size)/2;
            ctx.drawImage(img, sourceX, sourceY, size, size, 0, 0, MAX_DIMENSION, MAX_DIMENSION);
            var imgUrl = canvas.toDataURL('image/jpeg');
            this.setState({ photo: imgUrl });
            UserActions.updateProfilePhoto(_dataURItoBlob(imgUrl));
        }.bind(this);
    },
    render: function() {
        if (!!this.props.user.photo) {
            return (
                <div>
                    <img ref='imgNode' className='profilePicture' onClick={this.openFileDialog} src={this.props.user.photo}/>
                    {!!this.props.dynamic ? <h5 onClick={this.openFileDialog}>Change profile picture</h5> : null }
                    <input type='file' ref='fileInput' style={{ display: 'none' }} onChange={this.handleFile} />
                </div>
            );
        }
        else {
            var initials = this.props.user.first_name.charAt(0) + this.props.user.last_name.charAt(0);
            return (
                <div>
                    <svg onClick={this.openFileDialog} className='profilePicture' width="140px" height="140px" viewBox="0 0 140 140" version="1.1">
                        <g id="UI" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                            <g id="UX-Profile-Copy" transform="translate(-494.000000, -334.000000)">
                                <g id="Oval-276-+-AM" transform="translate(494.000000, 334.000000)">
                                    <circle id="Oval-276" fill="#718296" cx="70" cy="70" r="70"></circle>
                                    <text id="intials" x='70' y='70' fontFamily="Gotham Rounded" fontSize="54px" dy="18px" fill="#F5F7FA" textAnchor='middle'>
                                        {initials}
                                    </text>
                                </g>
                            </g>
                        </g>
                    </svg>
                    {!!this.props.dynamic ? <h5>Change profile picture</h5> : null }
                    <input type='file' ref='fileInput' style={{ display: 'none' }} onChange={this.handleFile} />
                </div>
            );
        }
    }
});


var TalentScore = React.createClass({
    propTypes: {
        score: React.PropTypes.number.isRequired,
    },
    render: function() {
        var bgColor;
        var text;
        if ( this.props.score >= 0.90 ) { bgColor = '#25AE90'; text = 'great match'; }
        else if (this.props.score >= 0.75 ) { bgColor = '#25AE90'; text = 'good match'; }
        else if (this.props.score >= 0.5 ) { bgColor = '#F5B651'; text = 'okay match'; }
        else { bgColor = '#CC6070'; text = 'poor match'; }
        return (
            <div className='talentScore' style={{backgroundColor: bgColor}}>
                <span className='score'>{ Math.round(100*this.props.score) + '%' }</span>
                <span className='text'>{text}</span>
            </div>
        );
    },
});

var FindTalent = React.createClass({
    render: function() {
        return (
            <svg className='findTalentIcon' width="18px" height="25px" viewBox="0 0 18 25">
                <g id="UI" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                    <g id="Mgr-New-Tickets" transform="translate(-371.000000, -113.000000)" fill="#DFE0E1">
                        <g id="Long-Ticket" transform="translate(325.000000, 70.500000)">
                            <g id="Group" transform="translate(46.000000, 43.000000)">
                                <path d="M12.531,7.0063 C14.461,7.0063 16.031,5.4363 16.031,3.5063 C16.031,1.5763 14.461,0.0063 12.531,0.0063 C10.601,0.0063 9.031,1.5763 9.031,3.5063 C9.031,5.4363 10.601,7.0063 12.531,7.0063" id="Fill-2964"></path>
                                <path d="M10.531,14.54 L10.531,18.506 C10.531,18.783 10.755,19.006 11.031,19.006 L14.031,19.006 C14.307,19.006 14.531,18.783 14.531,18.506 L14.531,14.54 C16.483,13.606 17.531,10.804 17.531,8.506 C17.531,8.23 17.307,8.006 17.031,8.006 L8.031,8.006 C7.755,8.006 7.531,8.23 7.531,8.506 C7.531,10.804 8.579,13.606 10.531,14.54" id="Fill-2965"></path>
                                <path d="M12.531,20.5063 C8.517,20.5063 6.165,19.6853 6.03,19.2673 C6.064,19.1553 6.603,18.6653 8.61,18.3143 C8.882,18.2663 9.064,18.0073 9.017,17.7353 C8.969,17.4643 8.708,17.2813 8.438,17.3293 C6.177,17.7243 5.031,18.3733 5.031,19.2563 C5.031,21.0323 9.745,21.5063 12.531,21.5063 C15.317,21.5063 20.031,21.0323 20.031,19.2563 C20.031,18.3743 18.889,17.7263 16.637,17.3313 C16.367,17.2833 16.106,17.4643 16.058,17.7363 C16.011,18.0083 16.193,18.2683 16.465,18.3163 C18.462,18.6673 18.998,19.1553 19.032,19.2453 C18.897,19.6853 16.545,20.5063 12.531,20.5063" id="Fill-2966"></path>
                                <path d="M16.5979,15.2593 C16.3219,15.2243 16.0739,15.4173 16.0379,15.6913 C16.0029,15.9653 16.1959,16.2163 16.4699,16.2513 C21.1059,16.8503 23.5309,18.3423 23.5309,19.5063 C23.5309,21.1613 19.0139,23.0063 12.5309,23.0063 C6.0489,23.0063 1.5309,21.1613 1.5309,19.5063 C1.5309,18.3423 3.9569,16.8493 8.5949,16.2513 C8.8689,16.2163 9.0619,15.9653 9.0269,15.6913 C8.9909,15.4173 8.7419,15.2243 8.4669,15.2593 C4.6299,15.7543 0.5309,17.1303 0.5309,19.5063 C0.5309,21.6883 4.7369,24.0063 12.5309,24.0063 C20.3259,24.0063 24.5309,21.6883 24.5309,19.5063 C24.5309,17.1313 20.4329,15.7553 16.5979,15.2593" id="Fill-2967"></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        );
    }
});

var Comment = React.createClass({
    render: function() {
        return (
            <svg className='commentIcon' width="25px" height="24px" viewBox="0 0 25 24">
            <g id="UI" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
            <g transform="translate(-1354.000000, -117.000000)" fill="#CBD0D4">
            <g transform="translate(325.000000, 70.500000)">
            <g transform="translate(1029.000000, 46.243000)">
            <path d="M17.0308,9.0068 C17.5068,9.0068 17.9728,9.0518 18.4298,9.1218 C18.4948,8.7428 18.5308,8.3498 18.5308,7.9418 C18.5308,3.8418 14.4938,0.5068 9.5308,0.5068 C4.5678,0.5068 0.5308,3.8418 0.5308,7.9418 C0.5308,9.9028 1.3858,11.7678 2.8908,13.1188 L1.0968,16.2588 C0.9908,16.4438 1.0138,16.6738 1.1538,16.8348 C1.2508,16.9458 1.3888,17.0068 1.5308,17.0068 C1.5928,17.0068 1.6568,16.9948 1.7168,16.9708 L6.5558,15.0348 C6.9908,15.1588 7.4428,15.2528 7.9028,15.3158 C7.9258,15.3188 7.9678,15.3118 7.9788,15.3198 C8.0538,15.3198 8.2978,15.3178 8.6568,15.2978 C9.3358,11.7838 12.8898,9.0068 17.0308,9.0068" id="Fill-1121"></path>
            <path d="M17.0308,10.0068 C12.9658,10.0068 9.5308,12.9838 9.5308,16.5068 C9.5308,19.8628 12.4088,22.7308 15.9648,23.0798 C15.9668,23.0798 15.9688,23.0798 15.9708,23.0808 C16.1198,23.0948 16.2728,23.0968 16.4248,23.1028 C16.5138,23.1058 16.6008,23.1148 16.6908,23.1148 L16.7068,23.1148 C16.9378,23.1138 17.1678,23.1028 17.3968,23.0808 C17.4808,23.0728 17.5638,23.0568 17.6478,23.0458 C17.7978,23.0268 17.9468,23.0078 18.0948,22.9788 C18.1898,22.9608 18.2838,22.9348 18.3788,22.9128 C18.5138,22.8808 18.6498,22.8498 18.7838,22.8108 C18.8798,22.7818 18.9748,22.7468 19.0708,22.7148 C19.2288,22.6608 19.3878,22.6098 19.5428,22.5458 L19.7238,22.6128 L23.3558,23.9748 C23.4128,23.9968 23.4718,24.0068 23.5308,24.0068 C23.6698,24.0068 23.8058,23.9488 23.9028,23.8408 C24.0398,23.6888 24.0698,23.4668 23.9778,23.2838 L22.8188,20.9648 L22.6528,20.6338 C22.7788,20.5208 22.8938,20.4018 23.0078,20.2818 C23.0618,20.2258 23.1138,20.1678 23.1648,20.1098 C23.2478,20.0138 23.3288,19.9178 23.4048,19.8188 C23.4398,19.7738 23.4748,19.7278 23.5078,19.6818 C23.5948,19.5618 23.6768,19.4398 23.7518,19.3148 C23.7698,19.2848 23.7888,19.2558 23.8058,19.2258 C23.8898,19.0818 23.9668,18.9348 24.0368,18.7848 C24.0438,18.7688 24.0518,18.7528 24.0598,18.7368 C24.1318,18.5758 24.1968,18.4108 24.2528,18.2438 C24.2558,18.2338 24.2598,18.2238 24.2628,18.2138 C24.3178,18.0468 24.3638,17.8758 24.4018,17.7018 C24.4048,17.6878 24.4088,17.6748 24.4118,17.6608 C24.4468,17.4968 24.4718,17.3288 24.4908,17.1588 C24.4938,17.1348 24.4988,17.1118 24.5008,17.0878 C24.5208,16.8968 24.5308,16.7028 24.5308,16.5068 C24.5308,12.9838 21.0958,10.0068 17.0308,10.0068" id="Fill-1122"></path>
            </g>
            </g>
            </g>
            </g>
            </svg>
        );
    }
});

var Dropback = React.createClass({
    render: function() {
        return (
            <svg className='dropbackIcon' width="14px" height="24px" viewBox="0 0 14 23" version="1.1">
            <g id="UI" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
            <g id="angle1-copy-3" transform="translate(6.500000, 11.727273) rotate(90.000000) translate(-6.500000, -11.727273) translate(-5.000000, 4.727273)" fill="#2F4B6B">
            <path d="M21.874649,1.48404626 L20.7743234,0.34128673 C20.6276314,0.188656928 20.4587869,0.112622596 20.2677901,0.112622596 C20.0773335,0.112622596 19.9084891,0.188656928 19.761797,0.34128673 L11.1115578,9.32484123 L2.46158875,0.3415673 C2.31489669,0.188937497 2.14605223,0.112903166 1.95532553,0.112903166 C1.76459884,0.112903166 1.59575438,0.188937497 1.44906231,0.3415673 L0.34873676,1.48432683 C0.201774545,1.63667607 0.128563589,1.812032 0.128563589,2.01011406 C0.128563589,2.20819612 0.202044696,2.38355205 0.34873676,2.53590128 L10.6052946,13.1882831 C10.7519866,13.3406323 10.9208311,13.4166667 11.1115578,13.4166667 C11.3022845,13.4166667 11.4708588,13.3406323 11.6175509,13.1882831 L21.874649,2.53590128 C22.0213411,2.38355205 22.0942819,2.20819612 22.0942819,2.01011406 C22.0942819,1.812032 22.0213411,1.63667607 21.874649,1.48404626 L21.874649,1.48404626 Z" id="Shape"></path>
            </g>
            </g>
            </svg>
        );
    }
});

var Dropdown = React.createClass({
    render: function() {
        return (
            <svg className='dropdownIcon' width="16px" height="10px" viewBox="0 0 22 14">
            <g stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
            <g transform="translate(-279.000000, -148.000000)" fill="#FFFFFF">
            <g transform="translate(279.000000, 148.000000)">
            <path d="M21.84644,2.34671111 L19.57428,0.625488889 C19.39036,0.485488889 19.11228,0.504933333 18.95388,0.667488889 L11.43868,8.41493333 L3.92612,0.667488889 C3.85044,0.588933333 3.7422,0.540711111 3.62604,0.532933333 C3.509,0.524377778 3.3946,0.5586 3.30572,0.625488889 L1.03356,2.34671111 C0.84876,2.48671111 0.82764,2.73171111 0.98604,2.89504444 L11.10428,13.3304889 C11.18788,13.4168222 11.3102,13.4666 11.43868,13.4666 C11.56716,13.4666 11.68948,13.4168222 11.77308,13.3304889 L21.89396,2.89504444 C21.96964,2.81648889 22.00748,2.7146 21.99868,2.61193333 C21.98988,2.50926667 21.93532,2.4136 21.84644,2.34671111"></path>
            </g>
            </g>
            </g>
            </svg>
        );
    }
});

var AddNewProject = React.createClass({
    render: function() {
        return (
            <div onClick={this.props.onClick} className='addNewProject'>
                <h5>Add New Project</h5>
                <svg width="25px" height="25px" viewBox="0 0 25 25" version="1.1">
                    <g id="UI" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd">
                        <g id="UX-Profile-Copy" transform="translate(-873.000000, -500.000000)" fill="#D5DBE3">
                            <g id="Fill-2337" transform="translate(873.000000, 500.000000)">
                                <path d="M24.0386,8.0295 L16.5386,8.0155 L16.5526,0.5155 C16.5536,0.3825 16.5006,0.2555 16.4066,0.1615 C16.3136,0.0675 16.1856,0.0145 16.0536,0.0145 L9.0316,0.0075 L9.0306,0.0075 C8.8986,0.0075 8.7716,0.0605 8.6776,0.1545 C8.5836,0.2475 8.5306,0.3745 8.5306,0.5075 L8.5306,8.0075 L1.0306,8.0075 C0.7546,8.0075 0.5306,8.2315 0.5306,8.5075 L0.5306,15.5075 C0.5306,15.7845 0.7546,16.0075 1.0306,16.0075 L8.5306,16.0075 L8.5306,23.5075 C8.5306,23.7845 8.7546,24.0075 9.0306,24.0075 L16.0306,24.0075 C16.3066,24.0075 16.5306,23.7845 16.5306,23.5075 L16.5306,16.0075 L24.0306,16.0075 C24.3066,16.0075 24.5306,15.7845 24.5306,15.5085 L24.5376,8.5305 C24.5376,8.2545 24.3146,8.0305 24.0386,8.0295"></path>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        );
    }
});

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
        var closedTickets = [1, 2, 5, 2, 4].map(e => getRandomInt(3, 11));//horrible hack
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


module.exports = {
    Dropdown: Dropdown,
    Comment: Comment,
    FindTalent: FindTalent,
    Dropback: Dropback,
    ApproveTalent: ApproveTalent,
    TalentScore: TalentScore,
    ProfilePicture: ProfilePicture,
    AddNewProject: AddNewProject,
    ProjectGraph: ProjectGraph,
};
