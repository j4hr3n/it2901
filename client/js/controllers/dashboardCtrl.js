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
    usersList: ()=> {
      //these parameters do nothing :C
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
  }



  //result = Meteor.users.find().fetch();
  //a = Meteor.users.find().count();


  //console.log(result);
  //console.log(a);
