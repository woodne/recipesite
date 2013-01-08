#!/usr/bin/env node

var express = require('express')
  , path = require('path')
  , http = require('http')
  , recipe = require('./routes/recipes');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/recipes', recipe.findAll);
app.get('/recipes/:id', recipe.findById);
app.post('/recipes', recipe.addRecipe);
app.put('/recipes/:id', recipe.updateRecipe);
app.delete('/recipes/:id', recipe.deleteRecipe);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});