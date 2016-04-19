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
          var temp = Events.find({});
          var valid = [];

         for(var i = 0; i < temp.length; i++){

            console.log("length");
      /*      for(var j = 0; j < temp.participants.length; j++){
                if(user._id == temp[i].participants[j]._id ){
                  valid.add(temp[i]);
                  break;
                }*/
          }
          return temp;

       },
   });

    this.removeEvent = (event) => {
      Meteor.call('deleteEvent', Meteor.user(), event);
    }
};
