angular
  .module('it2901')
  .controller('dashboardCtrl', dashboardCtrl);

function dashboardCtrl(){
  
}


function newsfeed() {
  $( "#randomID" ).load( "templates/dashboard.html" );
}
