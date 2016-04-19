angular
.module('it2901')
.controller('egneAktiviteterCtrl', egneAktiviteterCtrl);

function egneAktiviteterCtrl($scope, $reactive) {  
    $reactive(this).attach($scope);


    $scope.acceptEvent = function(eventId,bool){
      var evs = Meteor.user().profile.events
      if (bool == true){
        for (var i = 0; i < evs.length; i++) {
              if (evs[i]._id == eventId){
                swal("Accepted", "You are going to this event!", "success")
                Meteor.call('acceptEvent', eventId)
              }
            };
      }else{
        Meteor.call('denyEvent', eventId, function(err, result){
          if (!err){
            swal("Deleted", "You have declined the invitation.", "success");
          }
        })
      }
      
    }



    $('#status').popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 300,
      hide: 800
    }
  });
    $('.participants.button').popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 200,
      hide: 200
    }
  });
    $('.participating.button').popup({
    inline   : true,
    hoverable: true,
    position : 'bottom left',
    delay: {
      show: 200,
      hide: 200
    }
  });

    
    this.subscribe('events');

    this.helpers({
        user: () => {
          return Meteor.user()
        },

        events: () => {
          var temp = Events.find({});          
          var valid = [];

         for(var i = 0; i < temp.length; i++){

            //console.log("length");
      /*      for(var j = 0; j < temp.participants.length; j++){
                if(user._id == temp[i].participants[j]._id ){
                  valid.add(temp[i]);
                  break;
                }*/
          }
          return temp;
          
       },

       userEvents: () => {
         return Meteor.user().profile.events;
       }
   });

<<<<<<< HEAD
    this.removeEvent = (eventId) => {
        theEvent = Events.findOne({_id : eventId})
        if (Meteor.userId() == theEvent.owner){
          Meteor.call('deleteEvent', eventId, function(err, result){
            if (!err){
              swal("Deleted", "The event is now deleted", "success")
            }else{
              swal("Failed!", "Failed to delete the event", "error")
            }
          })
        }else{
          swal("Failed!", "You cannot delete this since you are not the owner of the event.", "error")
        }
=======
    this.removeEvent = (event) => {
      Meteor.call('deleteEvent', Meteor.user(), event);
>>>>>>> refs/remotes/origin/master
>>>>>>> 926f0735b9f90258bed9d89a3ed68832cf171a31
    }
}; 