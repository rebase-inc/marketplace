import React, { Component, PropTypes } from 'react';

function xValue(percentage, radius=46) {
    return radius * Math.sin(percentage*2*Math.PI);
}
function yValue(percentage, radius=46) {
    return radius * Math.cos(percentage*2*Math.PI);
}

const Colors = ['#3B9B8A', '#74C89A', '#5C9FCC', '#53687D', '#C46E62', '#7FB5B9', '#E69F6F'];

// This should really be combined with the ProfilePicture component but I'm in a hurry...
export default class ScoredProfilePicture extends Component {
    static propTypes = {
        user: React.PropTypes.object.isRequired,
        score: React.PropTypes.number.isRequired,
    };

    render() {
        const { user, score } = this.props;
        const initials = user.name.match(/\b(\w)/g).join('');
        const color = Colors[(user.id - 1) % Colors.length];
    
        const largeArc = score < 0.5 ? 0: 1;
        const x = 50 + xValue(score);
        const y = 50 - yValue(score);
        let scoreColor;
        if (score > 0.8) {
            scoreColor = '#40B89E';
        } else if (score > 0.6 ) {
            scoreColor = '#F2B046';
        } else {
            scoreColor = '#CC6070';
        }

        if (!!user.photo) {
            return (
                <svg className='profilePicture' width='100px' height='100px' viewBox='0 0 100 100'>
                    <defs>
                        <clipPath id="circleView">
                            <circle cx="50" cy="50" r="38" fill="#FFFFFF" />            
                        </clipPath>
                    </defs>
                    <g className='score' stroke='none' fill='none'>
                        <circle fill='none' stroke='#E5EDF1' strokeWidth='8' cx='50' cy='50' r='46'></circle>
                        <path fill='none' stroke={color} strokeWidth='8'
                        d={'M50 4 A 46 46 1 ' + largeArc + ' 1 ' + x + ' ' + y}/>
                        <text>
                            <tspan x='50' y='50' textAnchor='middle' fontSize='32px' dy='10px' fill={color}>{ Math.round(100*score) + '%' }</tspan>
                        </text>
                    </g>
                    <image x='12' y='12' height='76px' width='76px' className='picture' clipPath="url(#circleView)" xlinkHref={user.photo}/>
                </svg>
            );
        }
        else {
            return (
                <div>
                    <svg className='profilePicture' width='100px' height='100px' viewBox='0 0 100 100' version='1.1'>
                        <g className='score' stroke='none' fill='none'>
                            <circle fill='none' stroke='#E5EDF1' strokeWidth='8' cx='50' cy='50' r='46'></circle>
                            <path fill='none' stroke={color} strokeWidth='8'
                            d={'M50 4 A 46 46 1 ' + largeArc + ' 1 ' + x + ' ' + y}/>
                            <text>
                                <tspan x='50' y='50' textAnchor='middle' fontSize='32px' dy='10px' fill={color}>{ Math.round(100*score) + '%' }</tspan>
                            </text>
                        </g>
                        <g className='picture' stroke='none' strokeWidth='1' fill='none'>
                            <circle fill={color} cx='50' cy='50' r='38'></circle>
                            <text id='intials' x='50' y='50' fontFamily='Gotham Rounded' fontSize='32px' dy='10px' fill='#F5F7FA' textAnchor='middle'>
                                {initials}
                            </text>
                        </g>
                    </svg>
                </div>
            );
        }
    }
}

