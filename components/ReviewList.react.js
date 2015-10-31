import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';

import LoadingAnimation from './LoadingAnimation.react';
import Review from './Review.react';

import Fuse from '../utils/Fuse';

function searchReviews(reviews, searchText) {
    var fuseSearch = new Fuse(reviews, {threshold: 0.35, keys: ['ticket.title', 'ticket.project.name', 'ticket.project.organization.name'], id: 'id'});
    return fuseSearch.search(searchText.substring(0, 32));
}

export default class ReviewList extends Component {
    static propTypes = {
        reviews: PropTypes.array.isRequired,
        roles: PropTypes.object.isRequired,
        user: PropTypes.object.isRequired,
        select: PropTypes.func.isRequired,
    }
    render() {
        // TODO: Refactor so this takes a role, instead of user and list of roles
        const { reviews, user, roles, select } = this.props;
        let searchResults = !!this.props.searchText ? searchReviews(reviews, this.props.searchText) : reviews.map(a => a.id);
        return (
            <table className='contentList'>
                <tbody ref='tableBody'>
                    { reviews.filter(r => searchResults.indexOf(r.id) != -1).map(r =>
                         <Review user={user} roles={roles} review={r} select={select.bind(null, r.id)} key={r.id} />) }
                </tbody>
            </table>
        );
    }
};
