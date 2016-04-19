angular
.module('it2901')
.controller('egneAktiviteterCtrl', egneAktiviteterCtrl);

function egneAktiviteterCtrl($scope, $reactive) {  
    $reactive(this).attach($scope);

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
        events: () => {

         var user =  Meteor.user();

         if(user){
          return user.profile.events;

        }
        else{
          return null;
        }
          
       },
   });

    var user = Meteor.user();
    console.log("user:" + user);

    this.removeEvent = (event) => {
      var user = Meteor.user();
        Meteor.call('deleteEvent', user, event._id);
    }
}; 