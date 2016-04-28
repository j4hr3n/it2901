angular
    .module('it2901')
    .controller('exerciseCtrl', exerciseCtrl);

function exerciseCtrl() {
 }



 //Edit this so it checks if you already have added an exercise to your list, and can add exercises to your list
 $scope.addExercise = function(userId){
   theUser = Meteor.users.findOne({'_id' : userId})
   if ( userId === Meteor.userId() ){
     sweetAlert("Oops...", "Du har allerede lagt til denne øvelsen", "error");
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
