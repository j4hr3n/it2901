angular
    .module('it2901')
    .controller('indexCtrl', indexCtrl);

function indexCtrl($scope, $reactive, $state, $filter) {
  $reactive(this).attach($scope);

  var _selected;
  $scope.selected = undefined;

  this.subscribe('allUsers');

  this.helpers({
    isLoggedIn: () => {
      return Meteor.user() != undefined;
    },

    isAdmin: () => {
      if (Meteor.user()) {
        return Meteor.user().isAdmin;
        
      } else {
        return false;
      }
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

  // $scope.globalSearch = function(keyword){
  //   return $filter('filter')(keyword, {type: user.username} && {type: user.profile.nameFirst} && {type: user.profile.nameLast})
  //
  // }

//Test
  // function filterByName(users.profile, typeValue){
  //   return usersList.filter(function(user.profile)){
  //     matches_namefirst = user.profile.namefirst.indexOf(typedValue) != -1;
  //     matches_namelast = user.profile.namelast.indexOf(typedValue) != -1;
  //
  //     return matches_namefirst || namelast;
  //
  //   });
  // }
  // $scope.filterByName = filterByName;
  //

  this.logout = () => {
    Accounts.logout();
    $state.go("home")
  }
}
