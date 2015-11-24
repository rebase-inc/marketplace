import React, { Component, PropTypes } from 'react';

export default class ModalContainer extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired
        //loading: PropTypes.bool, // provide this so that the modal knows not to close if some action is happening
        //markedForClose: PropTypes.bool, // provide this so that modal can close on next update
    }

    render() {
        return (
            <div id='modalView'>
                <div id='modalDialog'>
                    <div onClick={this.props.close} id='modalClose'>
                        <img src='img/modal-close.svg'/>
                    </div>
                    {this.props.children}
                </div>
            </div>
        );
    }
};
