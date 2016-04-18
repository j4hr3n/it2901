angular
    .module('it2901')
    .controller('registerCtrl', registerCtrl);

function registerCtrl($scope, $reactive, $location) {
  $reactive(this).attach($scope);

  

  var link;

  $scope.uploadFile = function(){
      document.getElementById("profileUpload").className = "ui primary loading button";
      var file = document.getElementById('profilePicture').files[0];
      fd = new FormData();
      fd.append('image', file)
      var xhttp = new XMLHttpRequest();
      xhttp.open('POST', 'https://api.imgur.com/3/image');
      xhttp.setRequestHeader('Authorization', 'Client-ID 01b25f3a8aeeb72');
      xhttp.onreadystatechange = function () {
        if (xhttp.status === 200 && xhttp.readyState === 4) {
                  document.getElementById("profileUpload").className = "ui primary button";
                  document.getElementById("profileUpload").style.visibility = "hidden";
                  //var node = document.getElementById('profileUpload')
                  //node.parentNode.removeChild(node);
                   res = JSON.parse(xhttp.responseText);
                   link = res.data.link;
                   profileImg = document.getElementById('profileImg');
                   profileImg.src = link;
                   profileImg.style.visibility = "visible";
            };
      };
      xhttp.send(fd);
  }

  $scope.change = function(){
    document.getElementById('profileUpload').style.visibility = "visible";
  }

  this.user = {  // This is converted into an order-sensitive argument list
    'username': '',
    'password': '',
    'email': '',
    'profilePicture' : '',
    'nameFirst': '',
    'nameLast': '',
    'bio': ''
  };

  

  this.passwordRepeat = this.user.password;

  this.error = '';

  this.registerNewUser = () => {

    matchingUser = Meteor.users.findOne({ 'username' : this.user.username });
    this.user.profilePicture = link;
    console.log(_.values(this.user))

    if (matchingUser == null) {
      Meteor.apply('createNewUser', _.values(this.user), false, (err) => {
        if (err) {
          console.log("Failed creating new user: " + err);
          this.error = err
        }
        else {
          console.log("Created new user: " + this.user.username);
          $('.ui.small.modal.register').modal('hide');
          $location.path("/dashboard");
        }
      });
    } else {
      console.log("Failed creating new user: Non-unique username");
    }
  };
}
