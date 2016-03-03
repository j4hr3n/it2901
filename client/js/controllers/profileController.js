  // SPRINT 1 Debug
Users = new Mongo.Collection("users");

Users.insert(
  {
    name: 'Babak',
    friends: 24
  }
);

angular
    .module('it2901')
    .controller('profileCtrl', profileCtrl);

function profileCtrl($scope, $reactive) {
  $reactive(this).attach($scope);;
 
  this.helpers({
    user: () => {
      return Users.find({});
   }
  });

  this.babak = { name: 'Babak', friends: 24};

  this.incrementFriends = (user) => {

    this.babak.friends += 1;

    user.friends = user.friends+1;
    Users.update(
      { name: user.name },
      {
        name: user.name,
        friends: user.friends
      },
      { upsert: true }
  )};
  
}
