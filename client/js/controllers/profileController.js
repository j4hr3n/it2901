
angular
    .module('it2901')
    .controller('profileCtrl', profileCtrl);

function profileCtrl($scope, $reactive) {
  $reactive(this).attach($scope);


  this.helpers({
    user: () => {
      return Meteor.user() || Meteor.users.findOne({});
                        // ^ Debug
    },
    contacts: () => {
      return Meteor.users.find({}, {'username':1});
    },

    friends: () => {
      user =  Meteor.user();
      return user.profile.friends;
      
    },


    notifications: () => {
      user =  Meteor.user();
      return user.profile.nameFirst;

      //user.profile.notifications.friendRequest.info.length
    },

  });

  $scope.eventNotification = function(){
    user = Meteor.user();
    return user.profile.events.length
  } 

  
  $scope.profilePicture = function(){
    return Meteor.user().profile.profilePicture;
  }

  this.updateInfo = () => {

    Meteor.users.update(
      { _id: this.user._id },
      { 
        $set: {

          "profile.nameFirst": this.user.profile.nameFirst,
          "profile.nameLast": this.user.profile.nameLast,
          "profile.friends": this.user.profile.friends,
          "profile.bio": this.user.profile.bio } 
      }
    )
  }; 

  //Edit profile view
  console.log(this.user.profile.namefirst + "hello");
  $scope.editing = false;
  $scope.removeEdit =false;
  $scope.editProfile = "save";
  $scope.switchProfile = function() {
    if ($scope.editing == false) {                    
      if ($scope.removeEdit) {                        // -- Reset changed data
        $scope.editProfile = "save";
        $scope.removeEdit = false;
      }
      else {                                          // -- Allow user to change profildata
        $scope.editProfile = "edit";
        $scope.editing = true;
        console.log("edit");
      }
    }
    else {                                            // -- Save changed data
      $scope.editing = false;
      $scope.editProfile = "save";
    }
  }
    // if ($scope.editProfile == "saved") {
    //   $scope.editProfile = "edit";
    //   consle.log("edit")
    // }
    // else {
    //   $scope.editProfile = "saved";
    //   console.log("saved")
    // }


   // X-button 
  $scope.noEdit = function() {
    $scope.editing = false;
    $scope.removeEdit = true;
    $scope.switchProfile();
  }


// Fitness score


    var value = 1;
    var pos = 0;
    var progressHidden = false;
    var progressReset = false;
    var delay = 40;
    var progressEl = $('progress');

    // set interval
    var timer = setInterval(progress, 1000);

    function progress() {

      // run counter
      value++;
      if (value < 10) {
        progressEl.val(value);
        pos = 1 - (value / 10);
      } else if (value < (delay + 10)) {
        progressEl.val(10);
        pos = 0;
      } else {
        value = 1;
      }

      // update background
      progressEl.css('background-position', '0 ' + pos + 'em');

      // show/hide progress
      if (!progressHidden && value >= 10) {
        // progressEl.addClass("hidden");
        // progressHidden = true;
        progressReset = true

      } else if (progressHidden && value < 10 || progressReset) {
        progressEl.val(0);
        progressEl.removeClass("hidden");
        progressHidden = false;
        progressReset = false;
      }

    }
}
