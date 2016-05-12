Meteor.startup(function () {

  var debugData = true;
  
  if (debugData) {
    Exercises.remove({});
    Events.remove({});
    NewsPosts.remove({});
    Meteor.users.remove({});
  }

  if (debugData) {
    var users = [
      {
        'username': 'Babs',
        'password':'123',
        'email':'baf@idi.ntnu.no',
        'profile': {
          'nameFirst': 'Babak',
          'nameLast': 'Farschian',
          'profilePicture' : '/img/profile1.png'
        }
      },
      {
        'username': 'theRandy',
        'password':'123',
        'email':'RandsterS@ntnu.no',
        'profile': {
          'nameFirst': 'Randy',
          'nameLast': 'Savage',
          'profilePicture' : '/img/kristy.png'
        }
      },
      {
        'username': 'perp',
        'password':'123',
        'email':'pepa@ntnu.no',
        'profile': {
          'nameFirst': 'Per',
          'nameLast': 'Paal',
          'profilePicture' : '/img/profile1.png'
        }
      }
    ];

    for (var i = 0; i < users.length; i++) {
      user = users[i];

      Meteor.call('createNewUser', user.username, user.password, user.email, 
        user.profile.profilePicture, user.profile.nameFirst, user.profile.nameLast, "")
    }
    Meteor.call("setUserIsAdmin", "Babs", true);
  }
  
  if (debugData) {
    var events = [
      {
        createdBy: "Babs",
        name: 'Yoga på lørdag',
        description: 'Dette er event 1. Kun Randy er invitert',
        date: new Date(),
        location: "",
        participants: ["Babs","theRandy"],
        type: ["Innendørs"],
        exercises: "",
        public: false
      },
      {
        createdBy: "perp",
        name: 'Event2',
        description: 'Dette er event 2. Den er offentlig tilgjengelig',
        date: new Date(),
        location: "",
        participants: ["perp"],
        type: "",
        exercises: "",
        public: true
      }
    ];

    for (i = 0; i < events.length; i++) {
      newEvent = events[i];
      
      Meteor.call('createNewEvent', newEvent.createdBy, newEvent.name, newEvent.description, 
        newEvent.date, newEvent.location, newEvent.participants, newEvent.type, 
        newEvent.exercises, newEvent.public);
    }
  }

  if (debugData) {
    
    Meteor.call('addFriend', 
      Meteor.users.findOne({username: "perp"})._id, true,
      Meteor.users.findOne({username: "Babs"})._id)

    Meteor.call('createNewsPost', Meteor.users.findOne({username: "theRandy"})._id,
      { "joinedEvent": {
          eventID: Events.findOne({})._id }
        }, false);

    Meteor.call('addFriend', 
      Meteor.users.findOne({username: "theRandy"})._id, true,
      Meteor.users.findOne({username: "perp"})._id)

    Meteor.call('createNewsPost', Meteor.users.findOne({username: "theRandy"})._id,
      { "userPost": {
          title: "Hjemme fra bærturen",
          description: "Kom nettopp hjem fra turen til Bloksberg!" }
        }, true);
  }

  if (debugData) {
    Meteor.call("createNewExercise", Meteor.users.findOne({username: "Babs"})._id,
      "Sittende knehasetøy", "Sitt på en stol og roter ankelen", ["Fleksibilitet"], 
      "https://www.youtube.com/embed/jrTzmEhfmQI")

    Meteor.call("createNewExercise", Meteor.users.findOne({username: "Babs"})._id,
      "Gåøvelser", "Følg denne videoen", ["Styrke"], 
      "https://www.youtube.com/embed/TlM3Ev8y3ZU")

    Meteor.call("createNewExercise", Meteor.users.findOne({username: "Babs"})._id,
      "Øvelse for huksittende", "Du kan holde i hva som helst; et bordbein, et gjerde eller noe annet.", 
      ["Balanse"], "https://videos.files.wordpress.com/Ytoe9lld/huksittende-med-stc3b8tte_dvd.mp4")
  }

  Meteor.publish("newsfeedPosts", function (options) {

    if (!this.userId) {
      return null 
    } else {
      selector = {
        $or: [
          { $and: [
              { ownerID: {$exists: true}},
              { $or: [
                { ownerID: this.userId},
                { ownerID: { $in: 
                    Meteor.users.findOne({_id: this.userId}).profile.friends}}
              ]}
          ]},
          { $and: [
              { "public": true},
              { "public": {$exists: true}}
          ]}
        ]
      };//selector = {};

      Counts.publish(this, 'numberOfNewsfeedPosts',
        NewsPosts.find(selector), {noReady: true});

      return NewsPosts.find(selector, options);
    }
  });

  Meteor.publish("allUsers", function () {
    // "By default, the current user's username, emails and profile are
    // published to the client." http://docs.meteor.com/#/ffull/meteor_users
    return Meteor.users.find({}, {'profile': 1, 'username': 1});
  });
  Meteor.publish("events", () => { return Events.find({})});
  Meteor.publish("exercises", () => {return Exercises.find({})});

  Accounts.onCreateUser(function(options, user) { 
    user.isAdmin = false;
    // Override of onCreateUser, which normally copies over options.profile to user.profile
    if (options.profile)
      user.profile = options.profile;

    return user;
  });
});
