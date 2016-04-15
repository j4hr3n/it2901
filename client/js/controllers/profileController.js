
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

  $scope.test = function(){
    return Meteor.user().profile.notifications.friendRequests.length;
  }




  this.incrementFriends = () => {

    meteor.users.update(
      { _id: this.user._id },
      { $inc: { friends: 1 } }
    )
  };

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

  var friendList = []
  

  function isFriend(userId){
    friendObject = Meteor.user().profile.friends
    for (var i = 0; i < friendObject.length; i++) {
      friendList.push(friendObject[i]._id)
    };

    if (friendList.indexOf(userId) < 0){
      return false;
    }else{
      return true;
    }
  }

  friendRequestList = []
  function isRequest(userId){
    friendRequestObjects = Meteor.user().profile.notifications.friendRequests
    for (var i = 0; i < friendRequestObjects.length; i++) {
      friendRequestList.push(friendRequestObjects[i._id])
    };

    if (friendRequestList.indexOf(userId) < 0){
      return false;
    }else{
      return true;
    }
  }
  
  

  $scope.inviteFriend = function(userId){
    theUser = Meteor.users.findOne({'_id' : userId})
    if ( userId === Meteor.userId() ){
      sweetAlert("Oops...", "You cannot be your own friend.", "error");
    } else if ( isFriend(userId) == true){
      sweetAlert("Oops...", "You are already friend with this person!", "error");  
    } else if ( isRequest(userId) == true ){
      sweetAlert("Oops...", "You have already sent friend invitation to this person!", "error");  
    } else if ( isFriend(userId) == false ){
        reqList = []
        allRequests = Meteor.user().profile.notifications.friendRequests
        if (allRequests){
          for (var i = 0; i < allRequests.length; i++) {
            reqList.push(allRequests[i]._id)
          };
        }
        if (reqList.indexOf(userId) < 0 ){
          Meteor.call('inviteFriend', theUser)
          swal("Invitation sent", "An invitation has been sent", "success")
          friendRequestList.push(userId)
        }else{
          swal("Oops", "You've already got an invitation from this freind. You just need to approve it!", "error")
        }
        
    }else {
      sweetAlert("Oops...", "You are already friend with this person!", "error");  
    }
  }

  $scope.getFriends = function(){
    Meteor.call(
    'getFriends',
    function(error, result){
        if(error){
            console.log(error);
        } else {
            console.log(result);
        }
    }
  );
}

  $scope.friendRequests = function(){
    allRequests = []
    requests = Meteor.user().profile.notifications.friendRequests;
    for (var i = 0; i < requests.length; i++) {
      allRequests.push(requests[i])
    };
    return allRequests;
  }

  $scope.accept = function(userId, bool){
    if (bool == true){
      if ( isFriend(userId) == false ){
        Meteor.call("addFriend", userId, bool, function(err, result){
          swal("Accepted", "You are now friend with this person", "success")
          friendList.push(userId)
          index = friendRequestList.indexOf(userId)
          friendRequestList.splice(index, 1)
        })
      }

    }else if (bool == false){
      Meteor.call("addFriend", userId, bool, function(err, result){
        swal("Denied", "Request denied", "error");
      })

      /*if ( Meteor.user().profile.notifications.friendRequests.length == 0 ){
        location.reload()
      }*/
    }


  }


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
