/**
 * Created by Limjiuk on 2015-02-16.
 */
var mongodb = require('mongodb');
var server = new mongodb.Server('127.0.0.1', 27017, {auto_reconnect : true});
var client = new mongodb.Db('test', server, {w : 1});
var BSON = mongodb.BSONPure;


client.open(function(err, db){
    if(!err){
        console.log("Connected to 'test' database ");
        db.collection('users', {safe : true}, function(err, collection){
            if(err){
                console.log("The 'users' collection doesn't exist. Creating it with sample data...");
            }
        });
    }
});

exports.client = client;
exports.BSON = BSON;