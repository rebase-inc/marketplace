import React, { Component, PropTypes } from 'react';

export default class ModalContainer extends Component {
    static propTypes = {
        close: PropTypes.func.isRequired
    }

    render() {
        return (
            <div id='modalView' className='noselect'>
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
