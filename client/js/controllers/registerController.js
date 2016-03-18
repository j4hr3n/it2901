angular
    .module('it2901')
    .controller('registerCtrl', registerCtrl);

function registerCtrl($scope, $reactive, $location) {
  $reactive(this).attach($scope);

  this.user = {
    'username': 'NyBabs',
    'password':'123',
    'email':'baf@idi.ntnu.no',
    'profile': {
      'nameFirst': 'Babak',
      'nameLast': 'Farschian',
      'friends': 0
    }
  };
  this.passwordRepeat = this.user.password;

  this.error = '';

  this.registerNewUser = () => {

    console.log(Meteor.users.find({}));
    matchingUser = Meteor.users.findOne({ 'username' : this.user.username });

    if (matchingUser == null) {
      Accounts.createUser(this.user, (err) => {
        if (err) {
          console.log("Failed creating new user: " + err);
          this.error = err
        } 
        else {
          console.log("Created new user: " + this.user.username);
          $('.ui.small.modal.register').modal('hide');
          $location.path("/LoggedIn");
        }
      });
    } else {
      console.log("Failed creating new user: Non-unique username");
    }
  };
}
