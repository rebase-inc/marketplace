import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

function _dataURItoBlob(dataURI) {
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for(var i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
}

export default class ProfilePicture extends Component {
    static propTypes = {
        dynamic: React.PropTypes.bool ,
        user: React.PropTypes.object.isRequired,
        uploadPhoto: React.PropTypes.func.isRequired,
    };
    static defaultProps = { dynamic: false };

    constructor(props, context) {
        super(props, context);
        this.openFileDialog = this.openFileDialog.bind(this);
        this.handleFile = this.handleFile.bind(this);
    }

    openFileDialog() {
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
            this.props.uploadPhoto(_dataURItoBlob(imgUrl));
        }
    }

    render() {
        const { user, dynamic } = this.props;
        if (!!user.photo) {
            return (
                <div>
                    <img ref='imgNode' className='profilePicture' onClick={dynamic ? this.openFileDialog : null} src={user.photo}/>
                    { !!dynamic ? <h5 onClick={this.openFileDialog}>Change profile picture</h5> : null }
                    <input type='file' ref='fileInput' style={{ display: 'none' }} onChange={this.handleFile} />
                </div>
            );
        }
        else {
            const initials = user.name.match(/\b(\w)/g).join('');
            return (
                <div>
                    <svg onClick={dynamic ? this.openFileDialog : null} className='profilePicture' width="140px" height="140px" viewBox="0 0 140 140" version="1.1">
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

