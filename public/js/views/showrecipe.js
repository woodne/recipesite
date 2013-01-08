window.RecipeView = Backbone.View.extend({
    initialize: function() {
        this.render();
    },

    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteRecipe",
        "drop #picture" : "dropHandler"
    },

    change: function(event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function() {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.saveRecipe();
        return false;
    },

    saveRecipe: function() {
        var self = this;
        console.log('before save');
        this.model.save(null, {
            success: function(model) {
                self.render();
                app.navigate('recipes/' + model.id, false);
                utils.showAlert('Success!', 'Recipe saved successfully', 'alert-success');
            },
            error: function() {
                utils.showAlert('Error', 'An error occurred while trying to save this item', 'alert-error');
            }
        });
    },

    deleteRecipe: function() {
        this.model.destroy({
            success: function() {
                alert('Recipe deleted successfully');
                window.history.back();
            }
        });
        return false;
    },

    dropHandler: function(event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        var reader = new FileReader();
        reader.onloadend = function() {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    }  
});