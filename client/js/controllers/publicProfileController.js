angular
    .module('it2901')
    .controller('publicProfileCtrl', userProfile);

function userProfile($scope, $reactive, $stateParams) {
  $reactive(this).attach($scope);

  $scope.username = $stateParams.username;

  this.helpers({
    checkUser: () => {
      return "hello";
    }
  });

  $scope.user;

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

}



