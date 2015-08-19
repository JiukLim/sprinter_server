/**
 * Created by Limjiuk on 2015-02-10.
 */
var dbcontrol   = require('./dbcontroller');
var session_manager = require('./session_manager');

exports.upload = function(req, res){
    var token = req.headers['token'];
    var userId = req.params.userId;
    var image_string2base64 = req.body.image_string;
    var image_name = req.body.image_name;
    var category = req.body.category;
    var likecount = 0;
    var likelist = new Array();
    var currenttime = new Date();

    var insertdata = {
        "upload_Id" : userId,
        "image_name" : image_name,
        "likecount" : likecount,
        "category" : category,
        "image_string" : image_string2base64,
        "likelist" : likelist,
        "last_modified" : currenttime
    };

    var uploadprocess = function(){
        dbcontrol.client.collection('contents', function(err, collection){
            collection.insert(insertdata, {safe : true}, function(err, result){
                if(err){
                    res.send({"isSuccess" : false});
                }
                else{
                    res.send({"isSuccess" : true});
                }
            });
        });
    };
    session_manager.check_token(token, uploadprocess);
};
exports.download = function(req, res){

};
exports.like_count = function(req, res){

};
exports.like_update = function(req, res){
    // userId, token, contentId,
    var token = req.headers['token'];
    var userId = req.params.userId;
    var contentId = req.params.contentId;
    var isLike = req.body.isLike;
    var targetcontent = {};

    var getcontentprocess = function(callback){
        dbcontrol.client.collection('contents', function(err, collection){
            collection.findOne({"_id" : new dbcontrol.BSON.ObjectID(contentId)}, function(err, item){
                if(item != null){
                    targetcontent = item;
                    targetcontent.last_modified = new Date();
                    callback();
                }
            });
        });
    };
    var likeprocess = function(){
        // 좋아요 개수 조정 and 좋아요 리스트에 아이디 추가
        if(isLike === 'true'){
            var flag = false;
            for(var i in targetcontent.likelist){
                if(targetcontent.likelist[i] == userId){
                    flag = true;
                    break;
                }
            }
            if(flag != true){
                targetcontent.likecount += 1;
                targetcontent.likelist.push(userId);
            }
        }
        else{
            var flag = false;
            var deletetargetindex;
            for(var i in targetcontent.likelist){
                if(targetcontent.likelist[i] == userId){
                    flag = true;
                    deletetargetindex = i;
                    break;
                }
            }
            if(flag == true){
                targetcontent.likecount -= 1;
                targetcontent.likelist.splice(deletetargetindex, 1);
            }
        }
        dbcontrol.client.collection('contents', function(err, collection){
            collection.update({'_id' : new dbcontrol.BSON.ObjectID(contentId)}, targetcontent, {safe : true}, function(err, result){
                if(err){
                    console.log(err);
                    res.send({"isSuccess" : false, "content" : ""});
                }
                else{
                    res.send({"isSuccess" : true, "content" : targetcontent});
                }
            });
        });
    };
    session_manager.check_token(token, function(){
        getcontentprocess(function(){
            likeprocess();
        });
    });
};
exports.like_check = function(req, res){

};