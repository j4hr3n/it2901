angular
  .module('it2901')
  .controller('dashboardCtrl', dashboardCtrl);


function dashboardCtrl($scope, $reactive, $state) {

$reactive(this).attach($scope);

this.subscribe('exercises');

  this.helpers({
    user: () => {
      if (Meteor.user()) {
        return Meteor.user();

      } else {
        $state.go("home");
        //throw new Meteor.Error(403, "[Dashboard] Not logged in.");
        //return null;
      }

    },
   
    contacts: () => {
      return Meteor.users.find({}, {'username':1});
    },

    friends: () => {
      return Meteor.user().profile.friends;
    },
   
    notifications: () => {
      return Meteor.user().profile.nameFirst;
      //user.profile.notifications.friendRequest.info.length
    },

    messages: () => {
      return Meteor.user().profile.messages;
    }, 

    exercises: () => {
       exIds = Meteor.user().profile.exercises;
       //console.log("exLen: ", exIds); 
       display = [];

       for(var i = 0; i < exIds.length; i++){

           var oid = exIds[i]._id;
           //console.log("foundId: " , oid);
         // var ex = Exercises.find(oid);
           var ex = Exercises.findOne({_id : oid});
          //var ex = Exercises.find({ _id : oid})

          //console.log('allExercisesfromDB: ', Exercises.find({}));

          //ex = Exercises.findOne({exIds[i]._id});
          //console.log('ex: ', ex);
          display.push(ex);

       }
       //console.log('dispaly: ', display);
       return display;
    },

    friendRequestNotification: () => {
      return Meteor.user().profile.notifications.friendRequests.length;
    },

    messageRequestNotification: () => {
      return Meteor.user().profile.messages.length;
    },

    eventRequestNotification: () => {
      return Meteor.user().profile.events.length;
    },

    friendRequests: () => {
      return Meteor.user().profile.notifications.friendRequests;
    }
  });

  $scope.eventNotification = function(){
    return Meteor.user().profile.events.length
  }


  $scope.profilePicture = function(){
    return Meteor.user().profile.profilePicture;
  }

  $scope.messageList = []
  $scope.onSelect = function ($item, $model, $label) {
    if ($scope.messageList.indexOf($item.username) < 0){
      $scope.messageList.push($item.username);
      $scope.selected = null;
    }else{
      $scope.selected = null;
    }
  };

  $scope.sendMessage = function(message){
    if (message){
      $scope.message = "";
      Meteor.call('sendMessage', message, $scope.messageList, function(err, result){
        if (!err){
          swal("Message sent", "Your message has been sent!", "success");
          $scope.message = null;
          $('.ui.small.modal.messageModal').modal('hide');
        }else{
          swal("Failed", "Your message was not sent!", "error");
          console.log(err);
          $scope.message = null;
          $('.ui.small.modal.messageModal').modal('hide');
        }
      })
      $scope.messageList = [];
    }else {
      swal("Failed", "Message cannot be blank. Please type something!", "error");
    }

  }

  $scope.deleteMessage = function(message){
    Meteor.call('deleteMessage', message, function(err, result){
      if (!err){
        swal("Deleted", "The message is deleted!", "success")
        if ( Meteor.user().profile.messages.length == 0 ) {
          $('.ui.small.modal.inboxModal').modal('hide');
        }
      }else{
        swal("Error", "Failed to delete message!", "error")
      }
    })
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
      sweetAlert("Beklager!", "Du kan da ikke sende venneforespørsel til deg selv!", "error");
    } else if ( isFriend(userId) == true){
      sweetAlert("Beklager!", "Du er allerede venner med denne personen!", "error");
    } else if ( isRequest(userId) == true ){
      sweetAlert("Beklager!", "Du har allerede sendt en forespørsel til denne personen!", "error");
    } else if ( isFriend(userId) == false ){
        reqList = []
        allRequests = Meteor.user().profile.notifications.friendRequests
        if (allRequests){
          for (var i = 0; i < allRequests.length; i++) {
            reqList.push(allRequests[i]._id)
          };
        }
        if (reqList.indexOf(userId) < 0 ) {
          Meteor.call('inviteFriend', theUser)
          swal("Invitasjon sendt", "En venneforespørsel har blitt sendt!", "success")
          friendRequestList.push(userId)
        } else {
          swal("Oops", "Du har allerede mottatt en forespørsel fra denne personen. Det er bare å akseptere den!", "error")
        }

    } else {
      sweetAlert("Oops...", "Du er allerede venner med denne personen!", "error");
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


  $scope.accept = function(userId, bool){
    if (bool == true){
      if ( isFriend(userId) == false ){
        Meteor.call("addFriend", userId, bool, function(err, result){
          swal("Akseptert", "Du er nå venner med denne personen!", "")
          friendList.push(userId)
          index = friendRequestList.indexOf(userId)
          friendRequestList.splice(index, 1)
        })
        $('.ui.small.modal.friendModal').modal('hide');
      }

    }else if (bool == false){
      Meteor.call("addFriend", userId, bool, function(err, result){
        swal("Avslått", "Forespørselen ble avslått", "success");
      })
      $('.ui.small.modal.friendModal').modal('hide');
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
