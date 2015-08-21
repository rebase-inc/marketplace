var fakeUsers = {
    andrew: {
        first_name: 'Andrew',
        last_name: 'Millspaugh',
        photo: 'img/andrew.jpg',
        id: 1,
    },
    raphael: {
        first_name: 'Raphael',
        last_name: 'Goyran',
        photo: 'img/raphael.jpg',
        id: 2,
    },
}

var fakeComments = [
    { user: fakeUsers.andrew, text: '@rapha, I\'m convinced that you were right regarding the composite primary keys being a better choice. However, in the few places where we are using composite primary keys right now, I don’t think the relationship is being properly referenced. See the SQLAlchemy documentation for proper reference of a composite foreign key.', date: 'June 12' },
    { user: fakeUsers.raphael, text: 'What do you mean? Is this not correct (from job_fit model)? ```__table_args__ = ( DB.ForeignKeyConstraint( [contractor_id, ticket_set_id], [Nomination.contractor_id, Nomination.ticket_set_id], ondelete=\'CASCADE\'), {})```', date: 'June 12' },
    { user: fakeUsers.andrew, text: 'Hmm, that does look correct. The one I was looking at is in the bid model. It indirectly references the auction and contractor ids through the nomination model, though it doesn’t specifically reference the nomination model. This should instead be switched to a reference like above. I guess I should\'ve actually looked into the places where this was happening.', date: 'June 12' },
];

var fakeTickets = [
    { title: 'Abstract out state machine event resource creation', date: '1', id: '1', skillsRequired: 'Python | SQLAlchemy | Finite State Machine', comments: fakeComments },
    { title: 'For all ORM relationships that reference a table with composite foreign key, combine those keys into one relationship.', date: '2', id: '2', skillsRequired: 'Python | SQLAlchemy | Finite State Machine', comments: fakeComments },
    { title: 'Add permission checking to rebase REST object creation and up date methods.', date: '3', id: '3', skillsRequired: 'Python | SQLAlchemy | Finite State Machine', comments: fakeComments },
    { title: 'Refactor auction ORM model to remove organization helper relationship.', date: '5', id: '5', skillsRequired: 'Python | SQLAlchemy | Finite State Machine', comments: fakeComments },
    { title: 'Change bank account model initialization method to take a generic owner parameter.', date: '4', id: '4', skillsRequired: 'Python | SQLAlchemy | Finite State Machine', comments: fakeComments },
    { title: 'Do this one thing and then the other thing so we have more things to do.', date: '6', id: '6', skillsRequired: 'Python | SQLAlchemy | Finite State Machine', comments: fakeComments },
    { title: 'Delete every line of code from the codebase, destroy everybody\'s computers, and delete our github accounts.', date: '7', id: '7', skillsRequired: 'Python | SQLAlchemy | Finite State Machine', comments: fakeComments },
    { title: 'Play with the quadcopter for 10-15 hours.', date: '8', id: '8', skillsRequired: 'Python | SQLAlchemy | Finite State Machine', comments: fakeComments },
    { title: 'Build some really cool software, get a bunch of people to use it, and make a billion dollars.', date: '9', id: '9', skillsRequired: 'Python | SQLAlchemy | Finite State Machine', comments: fakeComments },
]

var _makeFakeContract = function(fakeTicket, index) {
    var _fakeContract = {
        id: index,
        bid: { work_offers: [{ ticket_snapshot: { ticket: fakeTicket } }]}
    }
    return _fakeContract
}

var _makeFakeContractWithReview = function(fakeTicket, index) {
    var _fakeContractWithReview = _makeFakeContract(fakeTicket, index);
    _fakeContractWithReview.bid.work_offers[0].work = { state: null, review: { rating: 1 } };
    return _fakeContractWithReview;
}

var _makeFakeAuction = function(fakeTicket, index) {
    var _fakeAuction = {
        id: index,
        ticket_set: { bid_limits: [{ ticket_snapshot: { ticket: fakeTicket } }] }
    }
    return _fakeAuction;
}

var fakeAuctions = fakeTickets.map(_makeFakeAuction);
var fakeContracts = fakeTickets.map(_makeFakeContract);
var fakeContractsWithReviews = fakeTickets.map(_makeFakeContractWithReview);

module.exports = {
    init: function() {
        localStorage.clear();
        localStorage.setItem('fakeTickets', JSON.stringify(fakeTickets));
        localStorage.setItem('fakeAuctions', JSON.stringify(fakeAuctions));
        localStorage.setItem('fakeContracts', JSON.stringify(fakeContracts));
        localStorage.setItem('fakeContractsWithReviews', JSON.stringify(fakeContractsWithReviews));
    }
}
