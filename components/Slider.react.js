import React, { Component, PropTypes } from 'react';

export default class Slider extends Component {
    static propTypes = {
        width: PropTypes.number.isRequired,
        min: PropTypes.number.isRequired,
        max: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
        onChange: PropTypes.func.isRequired,
        step: PropTypes.number,
    }

    static defaultProps = { step: 20 }

    render() {
        const { width, min, max, step, value, onChange } = this.props;
        return (
                <input type='range'
                    style={{width: width + 'px'}}
                    defaultValue={value}
                    min={min}
                    max={max}
                    step={step}
                    onChange={(event) => onChange(event.target.valueAsNumber)} />
        );
    }
};
