var CachingCollection = Backbone.Collection.extend({	
	initialize: function (models,opts) {
		this.listenTo(this, 'add', this.save);
		this.listenTo(this, 'remove', this.save);
		this.listenTo(this, 'reset', this.save);
		
		if (opts) {
			if (opts.name) {
				this.name = opts.name;
			}
		}
		
		this.init();
	},
	
	/* Can be overwritten by an inheriting class */
	init: function () {
	},
	
	loadCache: function () {
		var items = JSON.parse(window.localStorage.getItem(this.name+"Cache"));
		this.set(items);
	},
	
	loadLive: function (options) {
		$.ajax({ context: this,
			type: 'GET',
			url: this.url,
			cache: false})
			.fail(function () {
				options.error();
			})
			.done(function (data) {
				this.complete(data);
				options.success();
			});
	},
	
	/* Should be overloaded by another class */
	success: function () {
	},
	
	complete: function () {
	},
	
	sync: function (method, collection, options) {
		if (!this.name) {
			throw "No name defined for this generic collection";
		}
		
		if (this.length === 0) {
			this.loadCache();
		}
		
		if ((app.online == true) && this.url) {
			this.loadLive(options);
		} else {
			options.error();
		}
	},
	
	save: function () {
		window.localStorage.setItem(this.name+"Cache",JSON.stringify(this));
	}
});

var CachingCollectionView = Backbone.View.extend({
	el: '',
	displayName: '',
	icon: '',
	initialize: function (opts) {
		_.bindAll(this, 'itemAdded', 'refresh', 'onDeviceReady', 'onCollectionLoaded', 'onCollectionError');
	
		if (!this.collection) {
			throw "No collection specified";
		}
		
		this.collection = new this.collection();
		
		if (opts) {
			if (opts.displayName) {
				this.displayName = opts.displayName;
			}
			
			if (opts.icon) {
				this.icon = opts.icon;
			}
		}
		
		var tempEl = app.register(this.displayName,this.icon);
		this.initializeScroller(tempEl);
		
		this.listenTo(this.collection,"add",this.itemAdded);
		this.listenTo(app,"deviceready",this.onDeviceReady);
		
		this.render();
	},
	
	/* Should be overwritten */
	itemAdded: function () {
	},
	
	refresh: function () {
		this.scroller.refresh();
	},
	
	onDeviceReady: function () {
		this.$el.prepend("<div class='loadingbanner' style='width:"+this.$el.css("width")+"'>Loading...</div>");
		this.collection.fetch({success: this.onCollectionLoaded, error: this.onCollectionError});
	},
	
	onCollectionLoaded: function () {
		this.$el.children('.loadingbanner').remove();
	},
	
	onCollectionError: function () {
		this.$el.children('.loadingbanner').remove();
		this.$el.prepend("<div class='offlinebanner' style='width:100%'>Last updated "+this.collection.lastUpdate+"</div>");
		if (this.collection.lastUpdate == null) {
			this.$el.children('.offlinebanner').text("No connection");
		}
	},
	
	render: function () {
		this.$el.html("<h6>"+this.displayName+"</h6>");
	},
	
	initializeScroller: function (tempEl) {
		$(tempEl).append("<div class='scroller'></div>");
		this.setElement($(tempEl).children()[0]);
		this.scroller = new IScroll(tempEl);
	}
});