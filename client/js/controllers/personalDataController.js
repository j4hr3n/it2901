angular
    .module('it2901')
    .controller('personalDataCtrl', personalDataCtrl);

function personalDataCtrl($scope, $reactive, $stateParams) {
  $reactive(this).attach($scope);

if (!Meteor.user()) 
    throw new Meteor.Error(403, "Need to be logged in to access your own profile.");


  this.helpers({
    user: () => {
      return Meteor.user();
    },

   });

}
