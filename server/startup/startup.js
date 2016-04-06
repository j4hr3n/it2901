Meteor.startup(function () {
  Meteor.users.remove({});
  if (Meteor.users.find().count() === 0) {
    var users = [
      {
        'username': 'Babs',
        'password':'123',
        'email':'baf@idi.ntnu.no',
        'profile': {
          'nameFirst': 'Babak',
          'nameLast': 'Farschian',
          'friends': []
        }
      },
      {
        'username': 'theRandy',
        'password':'123',
        'email':'RandsterS@ntnu.no',
        'profile': {
          'nameFirst': 'Randy',
          'nameLast': 'Savage',
          'friends': []
        }
      },
      {
        'username': 'perp',
        'password':'123',
        'email':'pepa@ntnu.no',
        'profile': {
          'nameFirst': 'Per',
          'nameLast': 'P�l',
          'friends': []
        }
      }
    ];
  
    for (var i = 0; i < users.length; i++) {
      Accounts.createUser(users[i]);
    }
  }

  Meteor.publish("allUsers", function () {
    return Meteor.users.find({}, {'profile': 1, 'username': 1});
  });
  // "By default, the current user's username, emails and profile are
  // published to the client." http://docs.meteor.com/#/full/meteor_users
});
