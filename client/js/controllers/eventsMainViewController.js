angular
.module('it2901')
.controller('eventsMainViewCtrl', eventsMainViewCtrl);

function eventsMainViewCtrl($scope, $reactive) {

    $reactive(this).attach($scope);

    userff: () => {
      return Meteor.user().profile.events;
    }

  this.displayEvents;

    $scope.acceptEvent = function(eventId, bool) {

      if (bool == true) {

        Meteor.call('acceptEvent', eventId, function(err) {
          if (err) {
            swal("Oops", "En feil oppstod.", "error");
          } else {
            swal("Deltar!", "Du er nå satt som deltakende!", "success");
          }
        });

      } else {
        Meteor.call('denyEvent', eventId, function(err) {
          if (err) {
            swal("Oops", "En feil oppstod.", "error");
          } else {
            swal("Deltar ikke", "Du kommer ikke til å gå til denne aktivitetet.", "error");
          }
        });
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

      userEvents: () => {

        var displayedEvents = [];
        var profileEvents = Meteor.user().profile.events;

        var allEvents = Events.find({});

        for (var i = 0; i < profileEvents.length; i++){

          var temp = Events.findOne(profileEvents[i].eventId);
          temp.attending = profileEvents[i].attending;

          displayedEvents.push(temp);
        }

        allEvents.forEach(function(ev) {

          if(ev.public == true) {

            var should_insert = true;
            for(var i = 0; i < displayedEvents.length; i++) {

              // Stops duplicates from being added
              if(displayedEvents[i]._id == ev._id) {
                should_insert = false;
                break;
              }
            }
            if (should_insert) {
              ev.attending = 0;
              displayedEvents.push(ev);
            }
          }
        });

        //console.log("displayedEvents: ");
        for(var i = 0; i < displayedEvents.length; i++) {
          //console.log("displayedEvents: " + displayedEvents[i]._id);
        }
        //Sorter events på dato
        displayedEvents.sort(function(a,b) {
          return new Date(a.date) - new Date(b.date);
        });
       return displayedEvents;
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
