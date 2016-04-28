angular
    .module('it2901')
    .controller('personalDataCtrl', personalDataCtrl);

function personalDataCtrl($scope, $reactive, $stateParams) {
  $reactive(this).attach($scope);

  $scope.test = "hello world"


}
