angular
    .module('it2901')
    .controller('registerCtrl', registerCtrl);

function registerCtrl($scope, $reactive, $location) {
  $reactive(this).attach($scope);

  this.user = {
    'username': 'Babs',
    'password':'123',
    'nameFirst': 'Babak',
    'nameLast': 'Farschian',
    'friends': 0,
    'email':'baf@idi.ntnu.no'
  };
  /* 
  this.newUser = {
    'username': '',
    'password':'',
    'nameFirst': '',
    'nameLast': '',
    'friends': 0,
    'email':''
  };
  */

  this.registerNewUser = () => {

    matchingUser = Users.findOne({ 'username' : this.user.username });

    if (matchingUser === null) {
      Users.insert(this.user);
      $location.path("/LoggedIn");
    }
  };
}
