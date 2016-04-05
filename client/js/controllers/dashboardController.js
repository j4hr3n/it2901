angular
  .module('it2901')
  .controller('dashboardCtrl', dashboardCtrl);

function dashboardCtrl(){

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



/*Package Search*/
var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['packageName', 'description'];

PackageSearch = new SearchSource('packages', fields, options);

Template.searchResult.helpers({
  getPackages: function() {
    return PackageSearch.getData({
      transform: function(matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {isoScore: -1}
    });
  },

  isLoading: function() {
    return PackageSearch.getStatus().loading;
  }
});

Template.searchResult.rendered = function() {
  PackageSearch.search('');
};

Template.searchBox.events({
  "keyup #search-box": _.throttle(function(e) {
    var text = $(e.target).val().trim();
    PackageSearch.search(text);
  }, 200)
});
