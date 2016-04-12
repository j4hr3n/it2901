angular
  .module('it2901')
  .controller('dashboardCtrl', dashboardCtrl);

function dashboardCtrl($scope, $reactive) {


  var _selected;
  $scope.selected = undefined;


  $reactive(this).attach($scope);

  this.subscribe('users');

  this.helpers({
    // party() {
    //   return Parties.findOne({
    //     _id: $stateParams.partyId
    //   });
    // },
    users: ()=> {
      return Meteor.users.find({}, {'username':1});
    }
    });
  }



  result = Meteor.users.find().fetch();
  //a = Meteor.users.find().count();


  //console.log(result);
  //console.log(a);
