/**
 * Created by Limjiuk on 2015-02-10.
 */

var dbcontrol = require('./dbcontroller');
var session_manager = require('./session_manager');

exports.contents_list_bycategory = function(req, res){
    // category 별로 리턴한다. category구분이 없는 경우
    // popular, tattoo, logo, character , minishop
    var token = req.headers['token'];
    var userId = req.params.userId;
    var category = req.params.category;
    var page = req.query.page;
    var response_array = new Array();
    // db.contents.find().skip(5), db.contents.find().limit(5)
    // db.contents.find().sort({name : 1}).limit(5)
    var find_process = function(){
        var find_statement = {};
        if(category != "popular"){
            find_statement = {
                "category" : category
            };
        }
        dbcontrol.client.collection('contents', function(err, collection){
            collection.find(find_statement).sort({"likecount" : -1}).skip(20*(page-1)).limit(20).toArray(function(err, items){
                for(var i = 0;i<items.length;i++){
                    var currentitem = {};
                    var isLike;
                    if(items[i].likelist.indexOf(userId) == -1){
                        isLike = false;
                    }
                    else{
                        isLike = true;
                    }
                    currentitem = {
                        "_id" : items[i]._id,
                        "upload_Id" : items[i].upload_Id,
                        "image_name" : items[i].image_name,
                        "likecount" : items[i].likecount,
                        "category" : items[i].category,
                        "image_string" : items[i].image_string,
                        "isLike" : isLike,
                        "last_modified" : items[i].last_modified
                    };
                    response_array.push(currentitem);
                }
                res.send(response_array);
            });
        });
    };

    session_manager.check_token(token, function(){
        find_process();
    });
};
exports.contents_list_byfind = function(req, res){
    var token = req.headers['token'];
    var userId = req.params.userId;
    var findname = req.params.findname;
    var page = req.query.page;

    var response_array = new Array();

    var find_process = function(){
        dbcontrol.client.collection('contents', function(err, collection){
            collection.find({"image_name" : "\"picture\""}).sort({"likecount" : -1}).skip(20*(page-1)).limit(20).toArray(function(err, items){
                console.log(items);
                for(var i = 0;i<items.length;i++){
                    var currentitem = {};
                    var isLike;
                    if(items[i].likelist.indexOf(userId) == -1){
                        isLike = false;
                    }
                    else{
                        isLike = true;
                    }
                    currentitem = {
                        "_id" : items[i]._id,
                        "upload_Id" : items[i].upload_Id,
                        "image_name" : items[i].image_name,
                        "likecount" : items[i].likecount,
                        "category" : items[i].category,
                        "image_string" : items[i].image_string,
                        "isLike" : isLike,
                        "last_modified" : items[i].last_modified
                    };
                    response_array.push(currentitem);
                }
                res.send(response_array);
            });
        });
    };
    session_manager.check_token(token, function(){
        find_process();
    });
};

