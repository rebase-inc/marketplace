import React, { Component, PropTypes } from 'react';

export default class TalentScore extends Component {
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
