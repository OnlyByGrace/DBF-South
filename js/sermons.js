var SermonModel = Backbone.Model.extend({
	defaults: {
		'title':'',
        'description': '',
		'speaker':'',
		'date':'',
		'length':'',
		'downloaded':'',
		'url':''
	}
});

var SermonModelView = TemplateModelView.extend({
	className: 'sermon-item',
	template: 'sermon-template',
	
	onTap: function () {
        app.router.navigate("sermons/"+this.model.cid, {trigger: true});
	}
});

var SermonPopupView = Backbone.View.extend({
    className: "sermonPopup",
    events: {
        'click' : 'onClick'
    },
    initialize: function (opts) {
        _.bindAll(this, 'render', 'unrender','removeElement');
        
        if (!this.collection) {
            throw "No collection specified";
        }
        
        if (!opts || !opts.displayName) {
            throw "No display name specified";
        }
        
        this.displayName = opts.displayName;
        
        var source = $('#sermon-popup-template').html();
        this.template = Handlebars.compile(source);
        
        app.router.route("sermons/:id","sermonPopup");
        this.listenTo(app.router,'route',this.render);
    },
    
    render: function (route, params) {
        console.log(route);
        if (route != "sermonPopup") {
            return this.unrender();
        }

        if (!this.collection.get(params[0])) {
            return;
        }
    
        $(this.el).html(this.template(this.collection.get(params[0]).attributes));
        $('body').append(this.el);
        $(this.el).animate({ top: "0px" } /*{ complete: this.shown }*/);
    },
    
    unrender: function (route, params) {
        console.log(route);
        if ($.contains(document.body,this.el)) {
            $(this.el).animate({ top: "100%" }, {duration: 200, complete: this.removeElement });
        }
    },
    
    removeElement: function () {
        this.$el.remove();
    },
    
    onClick: function () {
        window.history.back();
    }
});

var SermonCollection = CachingCollection.extend({
	model: SermonModel,
	name: "sermons",
	url: "http://dbfsouth.org/sermons.xml",
	complete: function (data) {
        var self = this;
        $(data).find("item").each(function (index) { // or "item" or whatever suits your feed
            var el = $(this);
            var elData = {
                title: el.find("title").text(),
                description: el.find("description").text(),
                id: el.find("guid").text(),
                speaker: el.find("dc\\:creator").text(),
                url: el.find("enclosure").attr("url"),
                length: el.find("itunes\\:duration").text(),
                date: el.find("pubdate").text()
            };
            self.set(new SermonModel(elData),{remove : false});
        });
        app.trigger("getDownloads");
    }
});

var SermonCollectionView = CachingCollectionView.extend({
	displayName: 'Sermons',
	icon: "images/glyphicons_076_headphones.png",
	collection: SermonCollection,
    
    init: function () {
        this.popup = new SermonPopupView({collection: this.collection, displayName: this.displayName});
    },
	
	itemAdded: function (newModel) {
		var newView = new SermonModelView({model: newModel});
		this.$el.append(newView.render());
		this.refresh();
	}
});