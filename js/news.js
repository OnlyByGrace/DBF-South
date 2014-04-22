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
		_.bindAll(this, 'render');
		
		this.render();
	},
	
	render: function () {
		$(this.el).html(this.model.get("content"));
	}
});

var NewsCollection = Backbone.Collection.extend({
	model: NewsModel,
	
	initialize: function () {
		_.bindAll(this, 'loadCache','sync','save','complete');
		
		this.listenTo(this,"add",this.save);
		this.listenTo(this,"remove", this.save);
	},
	
	loadCache: function () {
		var tempCollection = window.localStorage.getItem("newsCache");
		tempCollection = JSON.parse(tempCollection);
		this.set(tempCollection);
	},
	
	loadLive: function () {	
		$.ajax({ context: this, type: 'GET', url: 'http://dbfsouth.org/?option=com_content&view=category&id=35&format=feed', cache: false, success: this.complete })
	},
	
	complete: function (data) {
		this.reset();
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
            self.add(new NewsModel(elData));
        });
	},
	
	sync: function () {
		if (this.length === 0) {
			this.loadCache();
		}
		if (app.online) {
			this.loadLive();
		}
	},
	
	save: function () {
		window.localStorage.setItem("newsCache",JSON.stringify(this.models));
	}
});

var NewsCollectionView = Backbone.View.extend({
	//className: 'scroller',
	initialize: function(opts) {
		_.bindAll(this,'deviceReady','render');
		
		if (opts) {
			this.displayName = opts.displayName;
		} else {
			this.displayName = "news";
		}
		this.setElement(app.register(this.displayName,"images/glyphicons_045_calendar.png"));
		//this.$el.addClass("wrapper");
		
		this.collection = new NewsCollection();
		this.collection.on("add",this.collection.save);
		
		this.listenTo(app, "deviceready", this.deviceReady);
		
		this.render();
	},
	
	render: function () {
		this.$el.append("<h6>News</h6>");
	},
	
	deviceReady: function () {
		this.collection.fetch();
	}
});