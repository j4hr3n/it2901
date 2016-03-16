Meteor.startup(function () {
  Users.remove({});
  
  if (Users.find().count() === 0) {
    var users = [
      {
        'username': 'Babs',
        'password':'123',
        'nameFirst': 'Babak',
        'nameLast': 'Farschian',
        'friends': 24,
        'email':'baf@idi.ntnu.no'
      },
      {
        'username': 'perp',
        'password':'123',
        'nameFirst': 'Per',
        'nameLast': 'Pål',
        'friends': 0,
        'email':'pepa@ntnu.no'
      },
      {
        'username': 'theRandy',
        'password':'123',
        'nameFirst': 'Randy',
        'nameLast': 'Savage',
        'friends': 101,
        'email':'randyS@ntnu.no'
      }
    ];
 
    for (var i = 0; i < users.length; i++) {
      Users.insert(users[i]);
    }
  }

  Meteor.publish("users", function () {
    return Users.find();
  });
  
  // "By default, the current user's username, emails and profile are 
  // published to the client." http://docs.meteor.com/#/full/meteor_users
});
