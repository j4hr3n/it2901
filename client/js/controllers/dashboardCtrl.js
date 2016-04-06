angular
  .module('it2901')
  .controller('dashboardCtrl', dashboardCtrl);

function dashboardCtrl($scope, $state){
	//$state.transitionTo('dashboard.event-list');
}


function newsfeed() {
  $( "#randomID" ).load( "templates/dashboard.html" );
}


$('.ui.search')
.search({
  /*Bytte ut source med data fra DB*/
  source: content
})
;

var content = [
  { title: 'Eirik' },
  { title: 'Alexander' },
  { title: 'Sarah' },
  { title: 'Emil' }
];

//
// /*Package Search*/
// var options = {
//   keepHistory: 1000 * 60 * 5,
//   localSearch: true
// };
// var fields = ['packageName', 'description'];
//
// PackageSearch = new SearchSource('packages', fields, options);
//
//
// /*Template is used in blaze, change to angular*/
//
// Template.searchResult.helpers({
//   getPackages: function() {
//     return PackageSearch.getData({
//       transform: function(matchText, regExp) {
//         return matchText.replace(regExp, "<b>$&</b>") //finds a match at beginning while typing
//       },
//       sort: {isoScore: -1}
//     });
//   },
//
//   isLoading: function() {
//     return PackageSearch.getStatus().loading;
//   }
// });
//
//
//
// Template.searchResult.rendered = function() {
//   PackageSearch.search('');
// };
//
// Template.searchBox.events({
//   "keyup #search-box": _.throttle(function(e) {
//     var text = $(e.target).val().trim();
//     PackageSearch.search(text);
//   }, 200)
// });


// https://angular-ui.github.io/

// setup app and pass ui.bootstrap as dep
var myApp = angular.module("angularTypeahead", ["ui.bootstrap"]);

// define factory for data source
myApp.factory("States", function(){
  var states = ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Dakota", "North Carolina", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"];

  return states;

});

// setup controller and pass data source
myApp.controller("TypeaheadCtrl", function($scope, States) {

	$scope.selected = undefined;

	$scope.states = States;

});
