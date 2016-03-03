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

  this.baba = 1;Users.find({}).hasNext();

  this.incrementFriends = (user) => {
    Users.update(
      { name: user.name },
      {
        name: user.name,
        friends: user.friends+1
      },
      { upsert: true }
  )};
  
}
