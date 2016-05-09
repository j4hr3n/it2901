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
        }else{
          swal("Oops", "Du har allerede mottatt en forespørsel fra denne personen. Det er bare å akseptere den!", "error")
        }

    }else {
      sweetAlert("Oops...", "Du er allerede venner med denne personen!", "error");
    }
  }


}
