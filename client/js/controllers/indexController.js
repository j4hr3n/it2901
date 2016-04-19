angular
    .module('it2901')
    .controller('indexCtrl', indexCtrl);

function indexCtrl($scope, $reactive, $location) {
  $reactive(this).attach($scope);

  var _selected;
  $scope.selected = undefined;

  this.subscribe('users');

  this.helpers({
    isLoggedIn: () => {
      return Meteor.userId() !== null;
    },
    currentUser: () => {
      return Meteor.user();
    },
    usersList: ()=> {
      //Filling in parameters does nothing :C
      return Meteor.users.find({}, {});
      // return Meteor.users.find({
      // users: {
      //           $elemMatch: {
      //                username: "Babs"
      //
      //           }
      //         }
      //       }
      //     )
    }
  });


  this.logout = () => {
    Accounts.logout();
    $location.path("/");
  }
}
