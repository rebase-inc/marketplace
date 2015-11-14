import React, { Component, PropTypes } from 'react';

export default class TalentScore extends Component {
    static propTypes = { score: React.PropTypes.number.isRequired, }

    render() {
        let color;
        let text;

        const { score } = this.props;

        // TODO: refactor this if else
        if ( score >= 0.97 ) { color = '#25AE90'; text = 'perfect match'; }
        else if ( score >= 0.90 ) { color = '#25AE90'; text = 'great match'; }
        else if ( score >= 0.75 ) { color = '#25AE90'; text = 'good match'; }
        else if ( score >= 0.5 ) { color = '#F5B651'; text = 'okay match'; }
        else { color = '#CC6070'; text = 'poor match'; }

        return (
            <div className='talentScore' style={{color: color}}>
                <span className='score'>{ Math.round(100*this.props.score) + '%' }</span>
                <span className='text'>{text}</span>
            </div>
        );
    }
};
