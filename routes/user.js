/* GET users listing. */

var dbcontrol   = require('./dbcontroller');

// 인자는 request와 response를 의미하는 듯
/* USER API*/
exports.list = function(req, res){
  res.send('respond with a resource');
};

exports.hello = function(req, res){
    res.send('node js is zzang zzang');
};

exports.join = function(req, res){
    var password = req.headers['password'];
    var userId = req.body.user_Id;
    var username = req.body.user_name;
    var useremail = req.body.email;
    var userphone = req.body.phone;
    var joininfo = {
        "user_Id" : userId,
        "password" : password,
        "user_name" : username,
        "email" : useremail,
        "phone" : userphone
    };
    dbcontrol.client.collection('users', function(err, collection){
        collection.insert(joininfo, {safe : true}, function(err, result){
            if(err){
                res.send({"isSuccess" : false});
            }
            else{
                res.send({"isSuccess" : true});
            }
        });
    });
    // res.writeHead(200, {"Content-Type":"text/plain", "password":password});
    // res.send(username + ' - ' + password);
}; // POST

exports.duplicate = function(req, res){
    var userId = req.params.userId;
    //console.log(userId);
    dbcontrol.client.collection('users', function(err, collection){
        collection.findOne({"user_Id" : userId}, function(err, item){
            if(item == null){
                res.send({"isDuplicated" : false});
            }
            else{
                res.send({"isDuplicated" : true});
            }
        });
    });
    //dbcontrol.client.collection('users', function(err, collection){
    //    collection.find().toArray(function(err, items){
    //        res.send(items);
    //    });
    //});
}; // GET

exports.login = function(req, res){
    var userId = req.params.userId;
    var password = req.headers['password'];
    dbcontrol.client.collection('users', function(err, collection){
        collection.findOne({"user_Id" : userId}, function(err, item){
            if(item != null){
                if(item.password == password){
                    res.send({
                        "isSuccess" : true,
                        "token" : item._id
                    });
                }
                else{
                    res.send({
                        "isSuccess" : false,
                        "token" : ""
                    });
                }
            }
            else{
                res.send({
                    "isSuccess" : false,
                    "token" : ""
                });
            }
        });
    });
    //req.accepts('application/json');
    //// input message handling
    //json = req.body;
    //console.log('name is : ' + json.name);
    //console.log('address is : ' + json.age);
    //res.json({result : 'success'});
}; // POST

exports.logout = function(req, res){
    var userId = req.params.userId;
    var token = req.headers['token'];
    dbcontrol.client.collection('users', function(err, collection){
        collection.findOne({"_id" : new dbcontrol.BSON.ObjectID(token)}, function(err, item){
            if(item != null){
                res.send({"isSuccess" : true});
            }
            else{
                res.send({"isSuccess" : false});
            }
        });
    });
}; // GET


/* POST users api*/