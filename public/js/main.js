var AppRouter = Backbone.Router.extend({
    routes: {
        ""                   : "home",
        "recipes"            : "list",
        "recipes/page/:page" : "list",
        "recipes/add"        : "addRecipe",
        "recipes/:id"        : "showRecipe",
        "about"              : "about"
    },

    initialize: function() {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function(id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

    list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var recipeList = new RecipeCollection();
        recipeList.fetch({success: function() {
            $('#content').html(new RecipeListView({model: recipeList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    showRecipe: function(id) {
        var recipe = new Recipe({_id: id});
        recipe.fetch({success: function() {
            $('#content').html(new RecipeView({model: recipe}).el);
        }});
        this.headerView.selectMenuItem();
    },

    addRecipe: function() {
        var recipe = new Recipe();
        $('#content').html(new RecipeView({model: recipe}).el);
        this.headerView.selectMenuItem('add-menu');
    },

    about: function() {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }
});

utils.loadTemplate(['HomeView', 'HeaderView', 'RecipeView', 'RecipeListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});