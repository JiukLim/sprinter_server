/**
 * Created by Limjiuk on 2015-02-16.
 */

var dbcontrol = require('./dbcontroller');

var check_token = function(token, callback){
    dbcontrol.client.collection('users', function(err, collection){
        collection.findOne({"_id" : new dbcontrol.BSON.ObjectID(token)}, function(err, item){
            if(item != null){
                callback();
            }
            else{
                console.log("incorrect user token!");
            }
        });
    });
};

exports.check_token = check_token;
