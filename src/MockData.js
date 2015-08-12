var fakeComments = [
    { name: 'Andrew Millspaugh', text: '@rapha, I\'m convinced that you were right regarding the composite primary keys being a better choice. However, in the few places where we are using composite primary keys right now, I don’t think the relationship is being properly referenced. See the SQLAlchemy documentation for proper reference of a composite foreign key.', date: 'June 12' },
    { name: 'Raphael Goyran', text: 'What do you mean? Is this not correct (from job_fit model)? ```__table_args__ = ( DB.ForeignKeyConstraint( [contractor_id, ticket_set_id], [Nomination.contractor_id, Nomination.ticket_set_id], ondelete=\'CASCADE\'), {})```', date: 'June 12' },
    { name: 'Andrew Millspaugh', text: 'Hmm, that does look correct. The one I was looking at is in the bid model. It indirectly references the auction and contractor ids through the nomination model, though it doesn’t specifically reference the nomination model. This should instead be switched to a reference like above. I guess I should\'ve actually looked into the places where this was happening.', date: 'June 12' },
    { name: 'Raphael Goyran', text: 'Now I\'m just going to keep responding so that we can make this view element overflow', date: 'June 12' },
    { name: 'Andrew Millspaugh', text: 'Sounds like a reasonable idea. How much do you think we have to gab to get it to overflow?', date: 'June 13' },
    { name: 'Raphael Goyran', text: 'I\'m not sure. One or two more messages ought to do it.', date: 'June 13' },
    { name: 'Andrew Millspaugh', text: 'Okay. Let\'s call it quits here, then.', date: 'June 13' },
];

module.exports = {
    init: function() {
        localStorage.clear();
        localStorage.setItem('newTickets', JSON.stringify([
            {
                title: 'Abstract out state machine event resource creation',
                date: '1',
                skillsRequired: 'Python | SQLAlchemy | Finite State Machine',
                comments: fakeComments
            },
            {
                title: 'For all ORM relationships that reference a table with composite foreign key, combine those keys into one relationship.',
                date: '2',
                skillsRequired: 'Python | SQLAlchemy | Finite State Machine',
                comments: fakeComments
            },
            {
                title: 'Add permission checking to rebase REST object creation and up date methods.',
                date: '3',
                skillsRequired: 'Python | SQLAlchemy | Finite State Machine',
                comments: fakeComments
            },
            {
                title: 'Refactor auction ORM model to remove organization helper relationship.',
                date: '5',
                skillsRequired: 'Python | SQLAlchemy | Finite State Machine',
                comments: fakeComments
            },
            {
                title: 'Change bank account model initialization method to take a generic owner parameter.',
                date: '4',
                skillsRequired: 'Python | SQLAlchemy | Finite State Machine',
                comments: fakeComments
            },
            {
                title: 'Do this one thing and then the other thing so we have more things to do.',
                date: '6',
                skillsRequired: 'Python | SQLAlchemy | Finite State Machine',
                comments: fakeComments
            },
            {
                title: 'Delete every line of code from the codebase, destroy everybody\'s computers, and delete our github accounts.',
                date: '7',
                skillsRequired: 'Python | SQLAlchemy | Finite State Machine',
                comments: fakeComments
            },
            {
                title: 'Play with the quadcopter for 10-15 hours.',
                date: '8',
                skillsRequired: 'Python | SQLAlchemy | Finite State Machine',
                comments: fakeComments
            },
            {
                title: 'Build some really cool software, get a bunch of people to use it, and make a billion dollars.',
                date: '9',
                skillsRequired: 'Python | SQLAlchemy | Finite State Machine',
                comments: fakeComments
            },
        ]));
    }
}
