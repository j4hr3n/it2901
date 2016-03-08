Meteor.startup(function () {
  Users.remove({});
  
  if (Users.find().count() === 0) {
    var users = [
      {
        'nameFirst': 'Babak',
        'nameLast': 'Farschian',
        'friends': 24
      },
      {
        'nameFirst': 'Per',
        'nameLast': 'Pål',
        'friends': 0
      },
      {
        'nameFirst': 'Randy',
        'nameLast': 'Savage',
        'friends': 101
      }
    ];
 
    for (var i = 0; i < users.length; i++) {
      Users.insert(users[i]);
    }
  }
});
