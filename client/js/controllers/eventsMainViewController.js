angular
.module('it2901')
.controller('eventsMainViewCtrl', eventsMainViewCtrl);

function eventsMainViewCtrl($scope, $reactive) {

    $reactive(this).attach($scope);

    userff: () => {
      return Meteor.user().profile.events;
    }

  this.displayEvents;

    $scope.acceptEvent = function(eventId,bool){
      var evs = Meteor.user().profile.events
      if (bool == true){
        for (var i = 0; i < evs.length; i++) {
              if (evs[i].eventId == eventId){
                swal("Accepted", "You are going to this event!", "success")
                Meteor.call('acceptEvent', eventId)
              }
            };
      } else if (bool == false) {
        Meteor.call('denyEvent', eventId, function(err, result){
          if (!err){
            swal("Declined", "You are not going to this event.", "error");
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
    this.subscribe('allUsers');

    this.helpers({
      user: () => {
        if (!Meteor.userId())
          throw new Meteor.Error(404, "Need to be logged in to access events.");
          
          return Meteor.user()
        },
       
      allEvents: () => {
        console.log("allev:")
        console.log(Events.find({}))
        return Events.find({});
      },

      userEvents: () => {

        var display = [];
        var evs = Meteor.user().profile.events;
        var all = Events.find({});

        for(var i = 0; i < evs.length; i++){

          var oid = evs[i].eventId;
          var temp = Events.findOne(oid);

          display.push(temp);
        }

        all.forEach(function(ev) {
          if(ev.public == true){
            var should_insert = true;
            for(var i = 0; i < display.length; i++){
              //Hindrer duplikater fra å bli lagt til
              if(display[i]._id == ev._id){
                should_insert=false;
                break;
              }
            }
            if (should_insert) {
              display.push(ev);
            }
          }
        });

        //console.log("display: ");
        for(var i = 0; i < display.length; i++){
          //console.log("display: " + display[i]._id);
        }
        //Sorter events på dato
        display.sort(function(a,b) {
          return new Date(a.date) - new Date(b.date);
        });
       return display;
     }
   });

    this.removeEvent = (eventId) => {
        theEvent = Events.findOne({_id : eventId})
        console.log("eventowner: " + theEvent.owner);
        console.log("userId: " + Meteor.userId());
        if (Meteor.user().username == theEvent.createdBy){
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
      }  
      
};
