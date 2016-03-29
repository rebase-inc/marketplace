import React, { Component, PropTypes } from 'react';

export default class TalentGrid extends Component {
    render() {
        const className = (skill, days) => {
            if (this.props.willAccept(skill, days)) {
               return this.props.willAccept(0.2 + skill, days) ? 'active' : 'active highlight';
            } else {
               return 'inactive';
            }
        }
        return (
            <svg className='talentGrid' width="380px" viewBox="0 0 380 180">
                <g className='dots' stroke="none" transform="translate(45, 0)">
                    <g className='labels' fontSize='12'>
                        <text>
                            <tspan x="-10" y="13" textAnchor='end'>{'Expert'}</tspan>
                        </text>
                        <text>
                            <tspan x="-10" y="138" textAnchor='end'>{'Novice'}</tspan>
                        </text>
                        <text>
                            <tspan x="10" y="165" textAnchor='middle'>{'One Day'}</tspan>
                        </text>
                        <text>
                            <tspan x="280" y="165" textAnchor='middle'>{'Seven Days'}</tspan>
                        </text>
                    </g>
                    <g id='one-day'>
                        <circle className={className(1, 1)} cx="10" cy="10" />
                        <circle className={className(0.8, 1)} cx="10" cy="35" />
                        <circle className={className(0.6, 1)} cx="10" cy="60" />
                        <circle className={className(0.4, 1)} cx="10" cy="85" />
                        <circle className={className(0.2, 1)} cx="10" cy="110" />
                        <circle className={className(0, 1)} cx="10" cy="135" />
                    </g>
                    <g id='two-day'>
                        <circle className={className(1, 2)} cx="55" cy="10"></circle>
                        <circle className={className(0.8, 2)} cx="55" cy="35"></circle>
                        <circle className={className(0.6, 2)} cx="55" cy="60"></circle>
                        <circle className={className(0.4, 2)} cx="55" cy="85"></circle>
                        <circle className={className(0.2, 2)} cx="55" cy="110"></circle>
                        <circle className={className(0, 2)} cx="55" cy="135"></circle>
                    </g>
                    <g id='three-day'>
                        <circle className={className(1, 3)} cx="100" cy="10"></circle>
                        <circle className={className(0.8, 3)} cx="100" cy="35"></circle>
                        <circle className={className(0.6, 3)} cx="100" cy="60"></circle>
                        <circle className={className(0.4, 3)} cx="100" cy="85"></circle>
                        <circle className={className(0.2, 3)} cx="100" cy="110"></circle>
                        <circle className={className(0, 3)} cx="100" cy="135"></circle>
                    </g>
                    <g id='four-day'>
                        <circle className={className(1, 4)} cx="145" cy="10"></circle>
                        <circle className={className(0.8, 4)} cx="145" cy="35"></circle>
                        <circle className={className(0.6, 4)} cx="145" cy="60"></circle>
                        <circle className={className(0.4, 4)} cx="145" cy="85"></circle>
                        <circle className={className(0.2, 4)} cx="145" cy="110"></circle>
                        <circle className={className(0, 4)} cx="145" cy="135"></circle>
                    </g>
                    <g id='five-day'>
                        <circle className={className(1, 5)} cx="190" cy="10"></circle>
                        <circle className={className(0.8, 5)} cx="190" cy="35"></circle>
                        <circle className={className(0.6, 5)} cx="190" cy="60"></circle>
                        <circle className={className(0.4, 5)} cx="190" cy="85"></circle>
                        <circle className={className(0.2, 5)} cx="190" cy="110" ></circle>
                        <circle className={className(0, 5)} cx="190" cy="135" ></circle>
                    </g>
                    <g id='six-day'>
                        <circle className={className(1, 6)} cx="235" cy="10"></circle>
                        <circle className={className(0.8, 6)} cx="235" cy="35"></circle>
                        <circle className={className(0.6, 6)} cx="235" cy="60"></circle>
                        <circle className={className(0.4, 6)} cx="235" cy="85"></circle>
                        <circle className={className(0.2, 6)} cx="235" cy="110"></circle>
                        <circle className={className(0, 6)} cx="235" cy="135" ></circle>
                    </g>
                    <g id='seven-day'>
                        <circle className={className(1, 7)} cx="280" cy="10"></circle>
                        <circle className={className(0.8, 7)} cx="280" cy="35"></circle>
                        <circle className={className(0.6, 7)} cx="280" cy="60"></circle>
                        <circle className={className(0.4, 7)} cx="280" cy="85"></circle>
                        <circle className={className(0.2, 7)} cx="280" cy="110"></circle>
                        <circle className={className(0, 7)} cx="280" cy="135" ></circle>
                    </g>
                </g>
            </svg>
        );
    }
}
