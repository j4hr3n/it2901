angular
  .module('it2901')
  .controller('loginCtrl', loginCtrl);

function loginCtrl($scope, $reactive, $state) {
  $reactive(this).attach($scope);

  this.credentials = {
    email: '',
    password: ''
  };

  this.error = '';



  this.login = () => {
    //alert(this.credentials.username)
    //alert(this.credentials.password)
    Meteor.loginWithPassword(
      this.credentials.email, this.credentials.password, (err) => {
        if (err) {
          console.log("Failed logging in: " + err);
          this.error = err
          $('.ui.small.modal.loginError').modal('show');

        } else {
          console.log("Logged in successfully");
          $('.ui.small.modal.login').modal('hide');
          $state.go("dashboard.eventlist.createEvent");
        }
      });
  };

  this.ok = () => {
    $('.ui.small.modal.loginError').modal('hide');
    $('.ui.small.modal.login').modal('show');
  };

}
