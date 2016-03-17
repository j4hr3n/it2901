angular
    .module('it2901')
    .controller('indexCtrl', indexCtrl);

function indexCtrl($scope, $reactive, $location) {
  $reactive(this).attach($scope);

  this.helpers({
    isLoggedIn: () => {
      return Meteor.userId() !== null;
    },
    currentUser: () => {
      return Meteor.user();
    }
  });

  this.logout = () => {
    Accounts.logout();
    $location.path("/");
  }
}
