Meteor.startup(function () {
  if (Users.find().count() === 0) {
    var users = [
      {
        'name': 'Babak',
        'friends': 24
      },
      {
        'name': 'Per Pål',
        'friends': 0
      },
      {
        'name': 'Randy Savage',
        'friends': 101
      }
    ];
 
    for (var i = 0; i < users.length; i++) {
      Users.insert(parties[i]);
    }
  }
});