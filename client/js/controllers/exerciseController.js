angular
  .module('it2901')
  .controller('exerciseCtrl', exerciseCtrl);

function exerciseCtrl($scope, $reactive) {  
    $reactive(this).attach($scope);

this.types = ['Balanse', 'Styrke', 'Fleksibilitet'];

this.url;

this.chosenExercise;
this.chosen = [];
this.visible = false;

this.exerciseMap = {};


 this.toggleSelection = function toggleSelection(type) {
    var idx = this.chosen.indexOf(type);

    if (idx > -1) {
      this.chosen.splice(idx, 1);
    }

    // is newly selected
    else {
      this.chosen.push(type);
    }
    console.log("selected: ", this.chosen);
  };

$('.ui.fluid.search.dropdown').dropdown({});
            this.droppedDropdown = true;

this.subscribe('exercises');

this.newExercise = {
  name: "",
  description: "",
  types: [],
  url: ""
};

var displayStates = [];
this.activate = (type) => {
  if(!inneholder.call(displayStates, type)){
      displayStates.push(type);
      document.getElementById(type).style.background = '#2185D0';
      document.getElementById(type).style.color = '#ffffff';
  }
  else{
    var idx = displayStates.indexOf(type);
    displayStates.splice(idx, 1);
    document.getElementById(type).style.background = '#ffffff';
      document.getElementById(type).style.color = '#2185D0';
  }
  console.log("activate: ", displayStates);
}

this.view = (types) => {
  if (displayStates.length == 0)
    return true;

  for (var i = 0; i < displayStates.length; i++){
    if(inneholder.call(types, displayStates[i])){
      return true
    }
  }
  return false;
}

this.revealSegment = () => {
  this.visible = !this.visible;
}

this.addToUser = () => {
  console.log('adding exercise to user. id: ', this.chosenExercise._id);
  Meteor.call('addExercisetoUser', Meteor.user()._id, this.chosenExercise._id);
}

this.helpers({
    Exercises: () => {
      this.exerciseMap = {}

      return Exercises.find({}).map((ex) => {
        this.exerciseMap[ex._id] = ex;

        return ex
      });
    },

    isAdmin: () => {
      if (Meteor.user()) {
        return Meteor.user().isAdmin;
        
      } else {
        return false;
      }
    },
  });

this.setUrl = (id) => {
  console.log("SetUrl: "+ id)
  this.chosenExercise = this.exerciseMap[id];
  this.url = this.chosenExercise.url;

  console.log("url: "+ this.url);
  document.getElementById('frame').setAttribute("src", this.url);
  $('.ui.modal.one').modal('show');
}

this.addExercise = () => {

  this.newExercise.owner = Meteor.user()._id;
   
  if (this.chosen.length > 0) {
      this.newExercise.types = this.chosen;
  }
  else {
    this.newExercise.types = [];
  }

  if (this.newExercise.url.includes("youtube.com/watch?v=")) {
    this.newExercise.url = this.newExercise.url.replace(
      "youtube.com/watch?v=", "youtube.com/embed/")
  }

  Meteor.call('createNewExercise', this.newExercise.owner, this.newExercise.name, 
    this.newExercise.description, this.newExercise.types, this.newExercise.url);
    
  this.newExercise = {};
};

this.removeExercise = (exerciseId) => {
  Meteor.call('removeExercise', exerciseId);
};

this.contains = (id, type) => {
 // console.log("id: ", id);
 // console.log("type: ", type);
    var ex = Exercises.findOne(id);
   // console.log("ex: ", ex);
    var tags = ex.types;
   // console.log("types: ", tags);
   for(var i = 0; i < tags.length; i++){
      if(tags[i] == type){
        return true;
      }
      else{
        return false;
      }
   }
};

//temp kode
var inneholder = function(needle) {
    // Per spec, the way to identify NaN is that it is not equal to itself
    var findNaN = needle !== needle;
    var indexOf;

    if(!findNaN && typeof Array.prototype.indexOf === 'function') {
        indexOf = Array.prototype.indexOf;
    } else {
        indexOf = function(needle) {
            var i = -1, index = -1;

            for(i = 0; i < this.length; i++) {
                var item = this[i];

                if((findNaN && item !== item) || item === needle) {
                    index = i;
                    break;
                }
            }

            return index;
        };
    }

    return indexOf.call(this, needle) > -1;
};


 }

