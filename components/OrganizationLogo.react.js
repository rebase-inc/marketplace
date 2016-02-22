import React, { Component, PropTypes } from 'react';

const Colors = ['#3B9B8A', '#74C89A', '#5C9FCC', '#53687D', '#C46E62', '#7FB5B9', '#E69F6F'];

export default class OrganizationLogo extends Component {
    static propTypes = {
        organization: React.PropTypes.object.isRequired,
    };

    render() {
        const { organization } = this.props;
        const color = Colors[(organization.id - 1) % Colors.length];

        if (!!organization.photo) {
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
                    <image x='12' y='12' height='76px' width='76px' className='picture' clipPath="url(#circleView)" xlinkHref={contractor.photo}/>
                </svg>
            );
        }
        else {
            return (
                <div>
                    <svg className='profilePicture' width='100px' height='100px' viewBox='0 0 100 100'>
                        <g className='picture' stroke='none' strokeWidth='1' fill='none'>
                            <circle fill={color} cx='50' cy='50' r='46'></circle>
                            <text id='name' x='50' y='50' fontFamily='Gotham Rounded' fontSize='50px' dy='16px' fill='#F5F7FA' textAnchor='middle'>
                                { organization.name[0].toUpperCase() }
                            </text>
                        </g>
                    </svg>
                </div>
            );
        }
    }
}

