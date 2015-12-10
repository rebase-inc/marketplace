import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import LoadingAnimation from './LoadingAnimation.react';

export default class InputField extends Component {
    static propTypes = {
        name: PropTypes.string,
        value: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
    }

    render() {
        const { name, value, onChange, placeholder } = this.props;
        return (
            <label>
                <input placeholder={placeholder} value={value} onChange={onChange} />
                { this.props.loading ? <LoadingAnimation /> : null }
            </label>
        );
    }
}
