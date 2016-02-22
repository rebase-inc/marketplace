import React, { Component, PropTypes } from 'react';

import ListElement from './ListElement.react';
import WorkStatus from './WorkStatus.react';
import ProfilePicture from './ProfilePicture.react';
import OrganizationLogo from './OrganizationLogo.react';

import { humanReadableTimeRemaining, humanReadableDate } from '../utils/date';
import { getContractTicket, getContractWork, getContractProject, getContractOrganization } from '../utils/getters';

import AuctionStatus from './AuctionStatus.react';

const Contract = (props) => (
    <ListElement {...props}
        icon={props.role == 'manager' ? <ProfilePicture user={props.bid.contractor.user} /> :
            <OrganizationLogo organization={getContractOrganization(props)} />}
        subtitle={'Finish by ' + humanReadableDate(props.bid.auction.finish_work_by, false, true)}
        title={getContractTicket(props).title}
        prefix={ props.role == 'manager' ? props.bid.contractor.user.name :
            (getContractProject(props).name + ' · ' + getContractOrganization(props).name) }
        info={<WorkStatus state={getContractWork(props).state} />} />
);

export default Contract;
