angular
  .module('it2901')
  .controller('dashboardCtrl', dashboardCtrl);

function dashboardCtrl() {
  var value = 1;
  var pos = 0;
  var progressHidden = false;
  var progressReset = false;
  var delay = 40;
  var progressEl = $('progress');

  // set interval
  var timer = setInterval(progress, 1000);

  function progress() {

    // run counter
    value++;
    if (value < 10) {
      progressEl.val(value);
      pos = 1 - (value / 10);
    } else if (value < (delay + 10)) {
      progressEl.val(10);
      pos = 0;
    } else {
      value = 1;
    }

    // update background
    progressEl.css('background-position', '0 ' + pos + 'em');

    // show/hide progress
    if (!progressHidden && value >= 10) {
      // progressEl.addClass("hidden");
      // progressHidden = true;
      progressReset = true

    } else if (progressHidden && value < 10 || progressReset) {
      progressEl.val(0);
      progressEl.removeClass("hidden");
      progressHidden = false;
      progressReset = false;
    }

  }
}


function newsfeed() {
  $( "#randomID" ).load( "templates/dashboard.html" );
}
