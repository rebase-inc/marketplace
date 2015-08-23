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
];

var _nextAvailableId = 0
var nextAvailableId = function() {
    _nextAvailableId++;
    return _nextAvailableId;
}

var fakeOrganizations = [ 'prestige', 'piedpiper', 'veridian', 'vandelay', 'initech' ];
var fakeProjects = ['marketing', 'stream4k', 'matchmaker', 'import', 'accounting' ];

function _makeFakeTicket(fakeTitle, index) {
    var _fakeTicket = {};
    _fakeTicket.title = fakeTitle;
    _fakeTicket.id = nextAvailableId();
    _fakeTicket.date = index;
    _fakeTicket.ticket_snapshots = [];
    _fakeTicket.skillsRequired = 'Python | SQLAlchemy | Finite State Machines';
    _fakeTicket.comments = JSON.parse(JSON.stringify(fakeComments));
    _fakeTicket.project = {};
    _fakeTicket.project.title = _.sample(fakeProjects);
    _fakeTicket.project.rating = Math.random() * 3 + 2;
    _fakeTicket.project.organization = {};
    _fakeTicket.project.organization.title = _.sample(fakeOrganizations);
    return _fakeTicket;
}

function _makeFakeOfferedTicket(fakeTicket, index) {
    var _fakeTicket = JSON.parse(JSON.stringify(fakeTicket));
    _fakeTicket.title = _fakeTicket.title + ' (OFFERED)';
    _fakeTicket.ticket_snapshots = [];
    _fakeTicket.ticket_snapshots.push({});
    _fakeTicket.ticket_snapshots[0].bid_limit = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.id = nextAvailableId();
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.state = 'waiting_for_bids';
    return _fakeTicket;
}

function _makeFakeInProgressTicket(fakeTicket, index) {
    var _fakeTicket = JSON.parse(JSON.stringify(fakeTicket));
    _fakeTicket.id = nextAvailableId();
    _fakeTicket.title = _fakeTicket.title + ' (IN PROGRESS)';
    _fakeTicket.ticket_snapshots = [];
    _fakeTicket.ticket_snapshots.push({});
    _fakeTicket.ticket_snapshots[0].bid_limit = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.id = nextAvailableId();
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.state = 'closed';
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids = [];
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids.push({});
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].contract = {foo:'bar'};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers = [];
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers.push({});
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers[0] = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers[0].work = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers[0].work.state = 'in_progress';
    return _fakeTicket;
}

function _makeFakeCompletedTicket(fakeTicket, index) {
    var _fakeTicket = JSON.parse(JSON.stringify(fakeTicket));
    _fakeTicket.id = nextAvailableId();
    _fakeTicket.title = _fakeTicket.title + ' (COMPLETED)';
    _fakeTicket.ticket_snapshots = [];
    _fakeTicket.ticket_snapshots.push({});
    _fakeTicket.ticket_snapshots[0].bid_limit = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.id = nextAvailableId();
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.state = 'closed';
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids = [];
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids.push({});
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].contract = {foo:'bar'};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers = [];
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers.push({});
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers[0] = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers[0].work = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers[0].work.state = 'completed';
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers[0].work.review = {};
    _fakeTicket.ticket_snapshots[0].bid_limit.ticket_set.auction.bids[0].work_offers[0].work.review.rating = 3;
    return _fakeTicket;
}

var _makeFakeContract = function(fakeTicket, index) {
    var _fakeContract = {};
    _fakeContract.id = nextAvailableId();
    _fakeContract.bid = {}
    _fakeContract.bid.work_offers = [];
    _fakeContract.bid.work_offers.push({});
    _fakeContract.bid.work_offers[0].ticket_snapshot = {};
    _fakeContract.bid.work_offers[0].ticket_snapshot.ticket = JSON.parse(JSON.stringify(fakeTicket));
    _fakeContract.bid.work_offers[0].ticket_snapshot.ticket.id = nextAvailableId();
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
    _fakeAuction.id = nextAvailableId();
    _fakeAuction.state = 'waiting_for_bids';
    _fakeAuction.ticket_set = {};
    _fakeAuction.ticket_set.bid_limits = [];
    _fakeAuction.ticket_set.bid_limits.push({});
    _fakeAuction.ticket_set.bid_limits[0].ticket_snapshot = {};
    _fakeAuction.ticket_set.bid_limits[0].ticket_snapshot.ticket = JSON.parse(JSON.stringify(fakeTicket));
    _fakeAuction.ticket_set.bid_limits[0].ticket_snapshot.ticket.id = nextAvailableId();
    return _fakeAuction;
}

var fakeTickets = fakeTitles.map(_makeFakeTicket);
var fakeOfferedTickets = fakeTickets.map(_makeFakeOfferedTicket);
var fakeInProgressTickets = fakeTickets.map(_makeFakeInProgressTicket);
var fakeCompletedTickets = fakeTickets.map(_makeFakeCompletedTicket);
var fakeAuctions = fakeTickets.map(_makeFakeAuction);
var fakeContracts = fakeTickets.map(_makeFakeContract);
var fakeContractsWithReviews = fakeContracts.map(_makeFakeContractWithReview);

var allFakeTickets = fakeTickets.concat(fakeOfferedTickets).concat(fakeInProgressTickets).concat(fakeCompletedTickets);

module.exports = {
    _tickets: allFakeTickets,
    _auctions: fakeAuctions,
    _contracts: fakeContracts,
    _contractsWithReviews: fakeContractsWithReviews,
    saveToDisk: function() {
        localStorage.clear();
        localStorage.setItem('fakeTickets', JSON.stringify(allFakeTickets));
        localStorage.setItem('fakeAuctions', JSON.stringify(fakeAuctions));
        localStorage.setItem('fakeContracts', JSON.stringify(fakeContracts));
        localStorage.setItem('fakeContractsWithReviews', JSON.stringify(fakeContractsWithReviews));
    }
}
