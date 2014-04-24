var CachingCollection = Backbone.Collection.extend({	
	initialize: function () {
		this.listenTo(this, 'add', this.save);
		this.listenTo(this, 'remove', this.save);
		this.listenTo(this, 'reset', this.save);
		
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
	displayName: '',
	icon: '',
	initialize: function (opts) {
		if (!this.collection) {
			throw "No collection specified";
		}
		
		if (opts.displayName) {
			this.displayName = opts.displayName;
		}
		
		if (opts.icon) {
			this.icon = opts.icon;
		}
		
		var tempEl = app.register(this.displayName,this.icon);
		this.initializeScroller(tempEl);
		
		this.listenTo(this.collection,"add",this.itemAdded);
		
		this.render();
	},
	
	itemAdded: function () {
	},
	
	refresh: function () {
		this.scroller.refresh();
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