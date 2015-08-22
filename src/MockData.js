var _ = require('underscore');

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

var fakeTitles = [
    'Abstract out state machine event resource creation',
    'For all ORM relationships that reference a table with composite foreign key, combine those keys into one relationship.',
    'Add permission checking to rebase REST object creation and up date methods.',
    'Refactor auction ORM model to remove organization helper relationship.',
    'Change bank account model initialization method to take a generic owner parameter.',
    'Do this one thing and then the other thing so we have more things to do.',
    'Delete every line of code from the codebase, destroy everybody\'s computers, and delete our github accounts.',
    'Play with the quadcopter for 10-15 hours.',
    'Build some really cool software, get a bunch of people to use it, and make a billion dollars.',
]

function _makeFakeTicket(fakeTitle, index) {
    var _fakeTicket = {};
    _fakeTicket.title = fakeTitle;
    _fakeTicket.id = index;
    _fakeTicket.date = index;
    _fakeTicket.ticket_snapshots = [];
    _fakeTicket.skillsRequired = 'Python | SQLAlchemy | Finite State Machines';
    _fakeTicket.comments = JSON.parse(JSON.stringify(fakeComments));
    return _fakeTicket;
}

var _makeFakeContract = function(fakeTicket, index) {
    var _fakeContract = {};
    _fakeContract.id = index;
    _fakeContract.bid = {}
    _fakeContract.bid.work_offers = [];
    _fakeContract.bid.work_offers.push({});
    _fakeContract.bid.work_offers[0].ticket_snapshot = {};
    _fakeContract.bid.work_offers[0].ticket_snapshot.ticket = JSON.parse(JSON.stringify(fakeTicket));
    return _fakeContract
}

var _makeFakeContractWithReview = function(fakeContract, index) {
    var _fakeContractWithReview = JSON.parse(JSON.stringify(fakeContract));
    _fakeContractWithReview.bid.work_offers[0].work = {}
    _fakeContractWithReview.bid.work_offers[0].work.state = null;
    _fakeContractWithReview.bid.work_offers[0].work.review = {};
    _fakeContractWithReview.bid.work_offers[0].work.review.rating = 3;
    return _fakeContractWithReview;
}

var _makeFakeAuction = function(fakeTicket, index) {
    var _fakeAuction = {};
    _fakeAuction.id = index;
    _fakeAuction.state = 'waiting_for_bids';
    _fakeAuction.ticket_set = {};
    _fakeAuction.ticket_set.bid_limits = [];
    _fakeAuction.ticket_set.bid_limits.push({});
    _fakeAuction.ticket_set.bid_limits[0].ticket_snapshot = {};
    _fakeAuction.ticket_set.bid_limits[0].ticket_snapshot.ticket = JSON.parse(JSON.stringify(fakeTicket));
    return _fakeAuction;
}

var fakeTickets = fakeTitles.map(_makeFakeTicket);
var fakeAuctions = fakeTickets.map(_makeFakeAuction);
var fakeContracts = fakeTickets.map(_makeFakeContract);
var fakeContractsWithReviews = fakeContracts.map(_makeFakeContractWithReview);

module.exports = {
    _tickets: fakeTickets,
    _auctions: fakeAuctions,
    _contracts: fakeContracts,
    _contractsWithReviews: fakeContractsWithReviews,
    saveAuctionsToDisk: function(auctions) {
        localStorage.setItem('fakeAuctions', JSON.stringify(auctions));
    },
    saveToDisk: function() {
        localStorage.clear();
        localStorage.setItem('fakeTickets', JSON.stringify(fakeTickets));
        localStorage.setItem('fakeAuctions', JSON.stringify(fakeAuctions));
        localStorage.setItem('fakeContracts', JSON.stringify(fakeContracts));
        localStorage.setItem('fakeContractsWithReviews', JSON.stringify(fakeContractsWithReviews));
    }
}
