angular
    .module('it2901')
    .controller('registerCtrl', registerCtrl);

function registerCtrl($scope, $reactive, $location) {
  $reactive(this).attach($scope);

  this.user = {  // This is converted into an order-sensitive argument list
    'username': '',
    'password': '',
    'email': '',
    'nameFirst': '',
    'nameLast': '',
    'bio': ''
  };
  
  this.passwordRepeat = this.user.password;

  this.error = '';

  this.registerNewUser = () => {

    matchingUser = Meteor.users.findOne({ 'username' : this.user.username });

    if (matchingUser == null) {
      Meteor.apply('createNewsPost', _.values(this.user), false, (err) => {
        if (err) {
          console.log("Failed creating new user: " + err);
          this.error = err
        }
        else {
          console.log("Created new user: " + this.user.username);
          $('.ui.small.modal.register').modal('hide');
          $location.path("/dashboard");
        }
      });
    } else {
      console.log("Failed creating new user: Non-unique username");
    }
  };
}
