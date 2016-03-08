angular
    .module('it2901')
    .controller('profileCtrl', profileCtrl);

function profileCtrl($scope, $reactive) {
  $reactive(this).attach($scope);
  
  this.helpers({
    user: () => {
      return Users.findOne({});
    }
  });
  Users.insert({
        'nameFirst': 'Babaks',
        'nameLast': 'sFarschian',
        'friends': 24
  });

  console.log("prctrl:")
  console.log(Users.find({}).count());
  console.log(Users.find({}));


  this.incrementFriends = () => {

    Users.update(
      { _id: this.user._id },
      { $inc: { friends: 1 } }
    )
  };

  this.updateInfo = () => {

    Users.update(
      { _id: this.user._id },
      { 
        $set: { 
        name: this.user.name,
        nameFirst: this.user.nameFirst,
        nameLast: this.user.nameLast,
        friends: this.user.friends } 
      }
    )
  };
  
}
