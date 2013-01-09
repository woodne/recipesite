window.Recipe = Backbone.Model.extend({
    urlRoot: "/recipes",
    idAttribute: "_id",

    initialize: function() {
        this.validators = {};

        this.validators.title = function(value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter a name"};
        };

        this.validators.ingredients = function(value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter some ingredients"};
        };

        this.validators.steps = function(value) {
            return value.length > 0 ? {isValid: true} : {isValid: false, message: "You must enter some steps"};
        };
    },

    validateItem: function(key) {
        return (this.validators[key]) ? this.validators[key](this.get(key)) : {isValid: true};
    },

    validateAll: function() {
        var messages = {};

        for (var key in this.validators) {
            if (this.validators.hasOwnProperty(key)) {
                var check = this.validators[key](this.get(key));
                if (check.isValid === false) {
                    messages[key] = check.message;
                }
            }
        }
        return _.size(messages) > 0 ? {isValid: false, messages: messages} : {isValid: true};
    },

    defaults: {
        _id: null,
        title: "",
        ingredients: [],
        description: "",
        steps: [],
        pictures: []
    }
});

window.RecipeCollection = Backbone.Collection.extend({
    model: Recipe,
    url: '/recipes'
});