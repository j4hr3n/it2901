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
  this.passwordRepeat = "123";
  /* 
  this.newUser = {
    'username': '',
    'password':'',
    'nameFirst': '',
    'nameLast': '',
    'friends': 0,
    'email':''
  };

  this.passwordRepeat = "";
  */

  this.registerNewUser = () => {

    matchingUser = null;//Users.findOne({ 'username' : this.user.username });

    if (matchingUser === null) {
      Users.insert(this.user);
      console.log("inserting");
      $location.path("/LoggedIn");
    } else {
      console.log("not inserting2");
      $location.path("/downloads");
    }
  };
}
