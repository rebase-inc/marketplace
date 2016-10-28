import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import Ribbon from './Ribbon.react';


const table = [
    ["_overall",        "Overall"],
    [".language",   "/Language"],
    [".3rd-party.", "/"],
];


function is3rdPartyLibrary(skill) {
    return skill[0].indexOf(".__third_party__.") == -1;
}

function replace(str) {
    return table.reduce( (before, sub) => before.replace(sub[0], sub[1]), str);
}

function renameSkill(skill) {
    return [replace(skill[0]), skill[1]];
}

function isOverall(skill) {
    return skill[0] == "Overall";
}

function isNotOverall(skill) {
    return skill[0] != "Overall";
}

function byTech(skillA, skillB) {
    if (skillA[0] > skillB[0]) {
        return 1;
    } else if (skillA[0] < skillB[0]) {
        return -1;
    }
    return 0;
}

export default class AchievementRibbons extends Component {
    static propTypes = {
        skills: PropTypes.array.isRequired,
    }

    render() {
        let { skills } = this.props;
        if (skills.length == 0) return ( <div>No Achievement Ribbons yet! Please click on 'Github Account'.</div> );
        // 0 remove 3rd-party library details, just keep the overall 3rd-party summary
        // 1 let's rename the technologies
        // 2 extract Overall, so we can list it first
        // 3 sort the remainder of the skills by technologies name
        // 4 prepend Overall to the remainer


        // 0
        let summary_skills = skills.filter(is3rdPartyLibrary);

        // 1
        let renamed_skills = summary_skills.map(renameSkill);

        // 2
        let overall = renamed_skills.find(isOverall);

        // 3
        let remainder = renamed_skills.filter(isNotOverall).sort(byTech);

        // 4
        let result = [ overall, ...remainder ];

        return (
            <div className='achievement-ribbons'>
                {
                    result.map( (entry, index) => <Ribbon key={index} tech={entry[0]} ranking={entry[1]} /> )
                }
            </div>
        );
    }
};
