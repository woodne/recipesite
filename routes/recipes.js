var mongo = require('mongodb');

var Server = mongo.Server
  , Db = mongo.Db
  , BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('recipedb', server, {safe: true});

db.open(function(err, db) {
    if (!eff) {
        console.log("Connected to 'recipedb' database");
        db.collection('recipes', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'recipes' collection doesn't exist. Creating it with sample data");
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving recipe: ' + id);
    db.collection('recipes', function(err, collection) {
        collection.findOne({'_id' : new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('recipes', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addRecipe = function(req, res) {
    var recipe = req.body;
    console.log('Adding recipe: ' + JSON.stringify(recipe));
    db.collection('recipes', function(err, collection) {
        collection.insert(recipe, {safe: true}, function(err, result) {
            if (err) {
                res.send({'error' : 'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

exports.updateRecipe = function(req, res) {
    var id = req.params.id;;
    var recipe = req.body;
    delete recipe._id;
    console.log('Updating recipe: ' + id);
    console.log(JSON.stringify(recipe));
    db.collection('recipes', function(err, collection) {
        collection.update({'_id': new BSON.ObjectID(id)}, recipe, {safe: true}, function(err, result) {
            if (err) {
                console.log('Error updating recipe: ' + err);
                res.send({'error' : 'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updates');
                res.send(recipe);
            }
        });
    });
};

exports.deleteRecipe = function(req, res) {
    var id = req.params.id;
    console.log('Deleting recipe: ' + id);
    db.collection('recipes', function(err, collection) {
        collection.remove({'_id': new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error' : 'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
};