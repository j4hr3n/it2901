angular
.module('it2901')
.controller('eventDetailsCtrl', eventDetailsCtrl);

function eventDetailsCtrl($scope, $stateParams, $reactive) {  
    $reactive(this).attach($scope);


    this.subscribe('events');
    this.subscribe('users');


    $scope.eventId = $stateParams.eventId;

    //$scope.deltar = Events.findOne({_id : $scope.eventId}).isAttendingCount;
    $scope.count = 0;

    $scope.participants = Events.findOne({_id : $scope.eventId}).participants
    for (var i = 0; i < $scope.participants.length; i++) {
      if ($scope.participants[i].attending == true){
          $scope.count++;
      }
    };

    /*$scope.participantCount = function(){
      var participants = Events.findOne({ _id : $scope.eventId}).participants
      for (var i = 0; i < participants.length; i++) {
        if (participants[i].attending == true){
          alert("true")
          $scope.count++;
        }
      };
      return $scope.count;

    }*/


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

    this.newEvent = {};


    this.helpers({
        events: () => {
           return Events.find({});
       },
       currentEvent: () => {
          return Events.findOne({_id: $stateParams.eventId});
        }, 
   });

    

}; 