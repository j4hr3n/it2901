angular
    .module('it2901')
    .controller('indexCtrl', indexCtrl);

function indexCtrl($scope, $reactive, $state) {
  $reactive(this).attach($scope);

  var _selected;
  $scope.selected = undefined;

  this.subscribe('allUsers');

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
    $state.go("home")
  }
}
