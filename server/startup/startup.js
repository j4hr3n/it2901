Meteor.startup(function () {

  Meteor.users.remove({});
  if (Meteor.users.find().count() === 0) {
    var users = [
      {
        'username': 'Babs',
        'password':'123',
        'email':'baf@idi.ntnu.no',
        'profile': {
          'nameFirst': 'Babak',
          'nameLast': 'Farschian',
          //'bio': 'Test bio for babs',
          'personalData' : [{'title': '', value: "69"}, {'title': '', value: "69"}, {'title': '', value: "69"}, {'title': '', value: "69"}, {'title': '', value: "69"}],
          'friends': [],
          'events' : [],
          'exercises' : [],
          'notifications' : {
            'friendRequests' : [],
            'activities' : []
          },
          'messages' : [],
          'profilePicture' : 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/7/005/068/396/32cc8e5.jpg'
        }
      },
      {
        'username': 'theRandy',
        'password':'123',
        'email':'RandsterS@ntnu.no',
        'profile': {
          'nameFirst': 'Randy',
          'nameLast': 'Savage',
          'personalData' : [{'title': '', value: "69"}, {'title': '', value: "69"}, {'title': '', value: "69"}, {'title': '', value: "69"}, {'title': '', value: "69"}],
          'friends': [],
          'events' : [],
          'exercises' : [],
          'notifications' : {
            'friendRequests' : [],
            'activities' : []
          },
          'messages' : [],
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
          'personalData' : [{'title': '', value: "69"}, {'title': '', value: "69"}, {'title': '', value: "69"}, {'title': '', value: "69"}, {'title': '', value: "69"}],
          'friends': [],
          'events' : [],
          'exercises' : [],
          'notifications' : {
            'friendRequests' : [],
            'activities' : []
          },
          'messages' : [],
          'profilePicture' : '/img/profile1.png'
        }
      }
    ];

    for (var i = 0; i < users.length; i++) {
      Accounts.createUser(users[i]);
    }
  }

  Events.remove({});
  if(Events.find().count() === 0){
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
        public: "false"
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
        public: "true"
      }
    ];

    for (i = 0; i < events.length; i++) {
      newEvent = events[i];

      Meteor.call('createNewEvent', newEvent.createdBy, newEvent.name, newEvent.description,
        newEvent.date, newEvent.location, newEvent.participants, newEvent.type,
        newEvent.exercises, newEvent.public);
    }
  }

  NewsPosts.remove({});
  if (NewsPosts.find().count() < 3) {
    /*var posts = [
      {
        "public": true,
        info: { "friendAdded": {
          newFriendID: Meteor.users.findOne()._id }
        },
        ownerID: Meteor.users.findOne({username: "perp"})._id,
        "public": true,
      },
      {
        info: { "newEvent": {
          eventID: Events.findOne()._id }
        },
        ownerID: Meteor.users.findOne({username: "Babs"})._id,
        "public": true,
      },
      {
        info: { "joinedEvent": {
          eventID: Events.findOne()._id }
        },
        ownerID: Meteor.users.findOne({username: "theRandy"})._id,
        "public": true,
      },
      {
        info: { userPost: {
          title: "Bilder fra bærturen",
          description: "Kom nettopp hjem fra turen til Bloksberg!" }
        },
        ownerID: Meteor.users.findOne({username: "theRandy"})._id,
        "public": true,
      }
    ];*/
    Meteor.call('createNewsPost', Meteor.users.findOne({username: "perp"})._id,
      { "friendAdded": {
          newFriendID: Meteor.users.findOne()._id }
        }, true);
    Meteor.call('createNewsPost', Meteor.users.findOne({username: "Babs"})._id,
      { "newEvent": {
          eventID: Events.findOne({})._id }
        }, true);
    Meteor.call('createNewsPost', Meteor.users.findOne({username: "theRandy"})._id,
      { "joinedEvent": {
          eventID: Events.findOne({})._id }
        }, true);
    Meteor.call('createNewsPost', Meteor.users.findOne({username: "theRandy"})._id,
      { "userPost": {
          title: "Bilder fra bærturen",
          description: "Kom nettopp hjem fra turen til Bloksberg!" }
        }, true);

    /*for (post in posts) {
      Meteor.call('createNewsPost', post.ownerID, post.info, post.public);/*,
        (error) => {
          if (error)
            throw new Meteor.Error(404, "failed to insert number "+i+" ("+error+")")
        });
    }*/
  }

  Meteor.publish("newsfeedPosts", function (options) {
    //if (this.userId) {
      selector = {
        $or: [
          { $and: [
              { ownerID: {$exists: true}},
              { $or: [
                { ownerID: this.userId}
                //{ ownerID: { $in: Meteor.users.findOne(this.userId).profile.friends}}
              ]}
          ]},
          { $and: [
              { "public": true},
              { "public": {$exists: true}}
          ]},
          { "public": {$exists: true}}
        ]
      };selector = {};

      Counts.publish(this, 'numberOfNewsfeedPosts',
        NewsPosts.find(selector), {noReady: true});

      return NewsPosts.find(selector, options);

    //} else {
     // return null;
   //}
  });

  Meteor.publish("allUsers", function () {
    return Meteor.users.find({}, {'profile': 1, 'username': 1});
  });
  // "By default, the current user's username, emails and profile are
  // published to the client." http://docs.meteor.com/#/ffull/meteor_users

  Meteor.publish("events", () => { return Events.find({})});
});
