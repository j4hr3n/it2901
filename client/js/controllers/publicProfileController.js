angular
    .module('it2901')
    .controller('publicProfileCtrl', userProfile);

function userProfile($scope, $reactive, $stateParams) {
  $reactive(this).attach($scope);

  $scope.username = $stateParams.username;
  

  this.helpers({
    checkUser: () => {
      return "hello";
    },

    isLoggedIn: () => {
      return Meteor.user() != undefined;
    },

    hello: () => {
      return true;
    }
  });

  $scope.user;


var friendList = []
  $scope.isFriend = function(){
    friendObject = Meteor.user().profile.friends
    for (var i = 0; i < friendObject.length; i++) {
      friendList.push(friendObject[i].username)
    };

    if (friendList.indexOf($scope.username) < 0){
      return false;
    }else{
      return true;
    }
  }

  
  $scope.inviteFriend = function(){
    theUser = Meteor.users.findOne({'username' : $scope.username})
    Meteor.call('inviteFriend', theUser)
    swal("Invitation sent", "An invitation has been sent", "success")
  }



  $scope.profilePicture = function(){
  	var theUser = Meteor.users.findOne({ username : $scope.username })
  	return theUser.profile.profilePicture;
  }

  $scope.world = function(){
  	var isUser = Meteor.users.findOne({ username : $scope.username})
  	if (isUser){
  		$scope.user = $scope.username;
  		return true;
  	}else{
  		return false;
  	}
  }

  $scope.unfriendConfirmation = function(){
    $('.ui.small.modal.unfriendConfirmation').modal('show');
  }

  $scope.unfriend = function(username, bool){
    if(bool == true){
      Meteor.call('deleteFriend', username, function(err, result){
        if (!err){
          swal("Unfriended", username + " is no longer your friend.", "success");
        }else {
          swal("Failed", "Some error occured!", "error")
        }
      })
      $('.ui.small.modal.unfriendConfirmation').modal('hide');
    }
    else if(bool == false){
      $('.ui.small.modal.unfriendConfirmation').modal('hide');
    }

  }

}
