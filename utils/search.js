import { getContractTicket, getReviewTicket } from '../utils/getters';
import Fuse from '../utils/fuse';

const fuseOptions = {
    threshold: 0.35,
    keys: [
        'title',
        'skill_requirement',
        'project.name',
        'project.organization.name'
    ],
    id: 'id'
};


function search(getTicket, things) {
    const tickets = things.map(getTicket);
    var fuseSearch = new Fuse(tickets, fuseOptions);
    return (searchText) => fuseSearch.search(searchText.substring(0, 32));
}

export const searchTickets = search.bind(null, (ticket) => ticket);
export const searchContracts = search.bind(null, getContractTicket);
export const searchReviews = search.bind(null, getReviewTicket);
