Users = new Mongo.Collection("users");

console.log("U1");
console.log(Users.find({}).count());
console.log(Users.find({}));
