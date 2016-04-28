angular
    .module('it2901')
    .controller('adminCtrl', adminCtrl);

function adminCtrl($scope, $reactive) {
  
$reactive(this).attach($scope);

  this.selected = Meteor.user();

 

  this.subscribe('users');



  this.helpers({

    usersList: ()=> {
      //Filling in parameters does nothing :C
      return Meteor.users.find({});
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

  this.savePersonalData = () => {

    console.log('hei');
    Meteor.call('updatePersonalData', this.selected._id, this.selected.profile.personalData);
  }
}