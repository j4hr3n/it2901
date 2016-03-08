angular
    .module('it2901')
    .controller('profileCtrl', profileCtrl);

function profileCtrl($scope, $reactive) {
  $reactive(this).attach($scope);;
 
  this.helpers({
    user: () => {
      return Users.findOne({});
   }
  });

  this.incrementFriends = (s) => {

    Users.update(
      { 'name': this.user.name },
      {
        'name': this.user.name,
        'friends': this.user.friends+1
      },
      { upsert: true }
  )};
  
}
