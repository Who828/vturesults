var mongourl = process.env.OPENSHIFT_MONGODB_DB_URL + process.env.OPENSHIFT_APP_NAME;
//var mongourl = "mongodb://mongodb:@localhost/test"
var usersCollection = 'users';
var db = require('mongojs').connect(mongourl, Array(usersCollection));

exports.addRecord = function(user, collection, callback) {
  objectToInsert = { name: user.name, email: user.email,
                      usn: user.usn };
  db.users.insert( objectToInsert , function(err) {
    if (err) { if (typeof callback == "function") callback(err); return; }
  });
}

exports.removeRecord = function(user, collection, callback) {
  objectToRemove = { name: user.name, email: user.email,
                      usn: user.usn };
  db.users.remove( objectToRemove , function(err) {
    if (err) { if (typeof callback == "function") callback(err); return; }
  });
}

exports.listRecords = function(collection, callback) {
  db.users.find().toArray(function(err, results) {
    callback(err, results);
  });
}

exports.listUsers = function(callback) {
  exports.listRecords(usersCollection, callback);
}

exports.addUser = function(user, callback) {
  exports.addRecord(user, usersCollection, callback);
}

exports.removeUser = function(user, callback) {
  exports.removeRecord(user, usersCollection, callback);
}

exports.disableUser = function(user, callback) {
  exports.addRecord(user, usersCollection + '_trash', function(err) {
    if (err) { if (typeof callback == "function") callback(err); return; }
  });
  exports.removeUser(user, function(err) {
    if (err) { if (typeof callback == "function") callback(err); return; }
  });
}
