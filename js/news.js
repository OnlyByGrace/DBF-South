var NewsModel = Backbone.Model.extend({
	defaults: {
		"title": '',
		"content": '',
		"date": ''
	},
	
	sync: function () {
	}
});

var NewsModelView = Backbone.View.extend({
	tagName: "div",
	className: "news-item",
	initialize: function () {
		_.bindAll(this, 'render','unrender');
		
		this.model.on("destroy",this.unrender);
		
		var source = $("#entry-template").html();
        this.template = Handlebars.compile(source);
	},
	
	render: function () {
		$(this.el).html(this.template(this.model.attributes));
		return this.el;
	},
	
	unrender: function () {
		if (this.$el) {
			this.remove();
		}
	}
});

var NewsCollection = Backbone.Collection.extend({
	model: NewsModel,
	lastUpdate: null,
	initialize: function () {
		_.bindAll(this, 'loadCache','sync','save','complete','fetch');
		
		this.listenTo(this,"add",this.save);
		this.listenTo(this,"remove", this.save);
	},
	
	loadCache: function () {
		var tempCollection = window.localStorage.getItem("newsCache");
		tempCollection = JSON.parse(tempCollection);
		this.set(tempCollection);
	},
	
	loadLive: function (options) {	
		$.ajax({ context: this,
			type: 'GET',
			url: 'http://dbfsouth.org/?option=com_content&view=category&id=35&format=feed',
			cache: false})
			.fail(function () {
				options.error();
			})
			.done(function (data) {
				this.complete(data);
				options.success();
			});
			
	},
	
	complete: function (data) {
        var self = this;
        $(data).find("item").each(function () { // or "item" or whatever suits your feed
            var el = $(this);
            var description = $('<div/>').html(el.find("description").text()).text();
			var thisDate = new Date(Date.parse(el.find("pubDate").text()));
            var elData = {
				title: el.find("title").text(),
				text: description,
				date: thisDate.toLocaleDateString(),
				id: el.find("guid").text()
			};
            //console.log(JSON.stringify(elData));
			self.set(new NewsModel(elData), {remove: false});
        });
		//console.log(this.toJSON());
		this.lastUpdate = new Date().toLocaleTimeString();
	},
	
	sync: function (method, collection, options) {
		if (this.length === 0) {
			this.loadCache();
		}
		if (app.online) {
			this.loadLive(options);
		} else {
			if (options) {
				options.error();
			}
		}
	},
	
	save: function () {
		window.localStorage.setItem("newsCache",JSON.stringify(this));
	}
});

var NewsCollectionView = Backbone.View.extend({
	initialize: function(opts) {
		_.bindAll(this,'deviceReady','render','itemAdded','collectionLoaded','collectionError');
		
		if (opts) {
			this.displayName = opts.displayName;
		} else {
			this.displayName = "news";
		}
		var tempEl = app.register(this.displayName,"images/glyphicons_045_calendar.png");
		$(tempEl).append("<div class='scroller'></div>");
		this.setElement($(tempEl).children('.scroller')[0]);
		this.scroller = new IScroll("#"+$(tempEl).attr('id'));
		
		this.collection = new NewsCollection();
		this.collection.on("add",this.itemAdded);
		
		this.listenTo(app, "deviceready", this.deviceReady);
		
		this.render();
	},
	
	itemAdded: function (newModel) {
		var newView = new NewsModelView({model: newModel});
		this.$el.append(newView.render());
		this.scroller.refresh();
	},
	
	render: function () {
		this.$el.prepend("<h6>News</h6>");
	},
	
	deviceReady: function () {
		this.$el.prepend("<div class='loadingbanner' style='width:"+this.$el.css("width")+"'>Loading...</div>");
		this.collection.fetch({success: this.collectionLoaded, error: this.collectionError});
	},
	
	collectionLoaded: function () {
		this.$el.children('.loadingbanner').remove();
	},
	
	collectionError: function () {
		this.$el.children('.loadingbanner').remove();
		this.$el.prepend("<div class='offlinebanner' style='width:"+this.$el.css("width")+"'>Last updated "+this.collection.lastUpdate+"</div>");
		if (this.collection.lastUpdate == null) {
			this.$el.children('.offlinebanner').text("No connection");
		}
	}
});