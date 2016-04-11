Meteor.startup(function () {
  Events.remove({});
  if(Events.find().count() === 0){
    var events = [
      {
        'name': 'Event1',
        'description': 'Dette er event 1'
      },
      {
        'name': 'Event2',
        'description': 'Dette er event 2'
      }
    ];

    for (var i = 0; i < events.length; i++) {
        Events.insert(events[i]);
    }
  }


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
          'friends': [],
          'notifications' : {
            'friendRequests' : [],
            'activities' : []
          }
        }
      },
      {
        'username': 'theRandy',
        'password':'123',
        'email':'RandsterS@ntnu.no',
        'profile': {
          'nameFirst': 'Randy',
          'nameLast': 'Savage',
          'friends': [],
          'notifications' : {
            'friendRequests' : [],
            'activities' : []
          }
        }
      },
      {
        'username': 'perp',
        'password':'123',
        'email':'pepa@ntnu.no',
        'profile': {
          'nameFirst': 'Per',
          'nameLast': 'P�l',
          'friends': [],
          'notifications' : {
            'friendRequests' : [],
            'activities' : []
          }
        }
      }
    ];
  
    for (var i = 0; i < users.length; i++) {
      Accounts.createUser(users[i]);
    }
  }

  if (NewsPosts.find().count() < 3) {
    var posts = [
      {
        type: "friendAdded",
        info: { newFriendID: Meteor.users.findOne({username: "perp"})._id},
        date: new Date(),
        owner: Meteor.users.findOne({username: "therandy"})._id,
        "public": true
      },
      {
        type: "newEvent",
        info: { eventID: Events.findOne()._id},
        date: new Date(),
        owner: Meteor.users.findOne({username: "Babs"})._id,
        "public": true
      },
      {
        type: "joinedEvent",
        info: { eventID: Events.findOne()._id},
        date: new Date(),
        owner: Meteor.users.findOne({username: "therandy"})._id,
        "public": true
      },
    ];

    NewsPosts.remove({});  
    for (post in posts) {
      NewsPosts.insert(post);
    }
  } 

  Meteor.publish("newsfeedPosts", function (options) {
    //if (this.userId) {
      selector = {
        $or: [
          { $and: [
              { owner: {$exists: true}},
              { $or: [
                { owner: this.userId}
                //{owner: { $in: Meteor.user().profile.friends}},
              ]}
          ]},
          { $and: [
              { "public": true},
              { "public": {$exists: true}}
          ]},
          { "public": {$exists: true}}
        ]
      };

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
  // published to the client." http://docs.meteor.com/#/full/meteor_users
});