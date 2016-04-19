angular
    .module('it2901')
    .controller('networkController', networkController);

function networkController($scope, $reactive) {
  $reactive(this).attach($scope);


  this.helpers({
    user: () => {
      return Meteor.user();
    },

    contacts: () => {
      return Meteor.users.find({}, {'username':1});
    },

    friends: () => {
      user = Meteor.user();
      return user.profile.friends;
    }
  });

}
