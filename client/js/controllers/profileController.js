
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

    if (this.user.nyttpassord){
      Meteor.call('endrePassord', this.user.nyttpassord, function(err, result){
        if (!err){
          swal('Success', 'Your password has been changed! Please login with your new password', "success")
        }else {
          swal('Failed!', 'There were some errors with changing your password. Please try again!', "error")
        }
      })
    }
    
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

    //Upload profile pic
    var link;

    $scope.uploadFile = function(){
        document.getElementById("profileUpload").className = "ui primary loading button";
        var file = document.getElementById('PicButton').files[0];
        fd = new FormData();
        fd.append('image', file)
        var xhttp = new XMLHttpRequest();
        xhttp.open('POST', 'https://api.imgur.com/3/image');
        xhttp.setRequestHeader('Authorization', 'Client-ID 01b25f3a8aeeb72');
        xhttp.onreadystatechange = function () {
          if (xhttp.status === 200 && xhttp.readyState === 4) {
                    document.getElementById("profileUpload").className = "ui primary button";
                    document.getElementById("profileUpload").style.visibility = "hidden";
                    //var node = document.getElementById('profileUpload')
                    //node.parentNode.removeChild(node);
                     res = JSON.parse(xhttp.responseText);
                     link = res.data.link;
                     //console.log(link)
                     PicID = document.getElementById('PicID');
                     PicID.src = link;
                     //Meteor.user().profile.profilePicture = link;
                     PicID.style.visibility = "visible";
                     Meteor.call('addProfilePicture', link)
              };
        };
        xhttp.send(fd);
    }

    $scope.change = function(){
      document.getElementById('profileUpload').style.visibility = "visible";
    }

    // console.log('hei');
    // console.log(link);



}
