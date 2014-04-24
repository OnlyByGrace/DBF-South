var CachingCollection = Backbone.Collection.extend({	
	initialize: function () {
		this.listenTo(this, 'add', this.save);
		this.listenTo(this, 'remove', this.save);
		this.listenTo(this, 'reset', this.save);
		
		this.init();
	},
	
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
	
	sync: function (method, collection, options) {
		if (this.length === 0) {
			this.loadCache();
		}
		
		if (app.online == true) {
			this.loadLive(options);
		} else {
			options.error();
		}
	},
	
	save: function () {
		window.localStorage.setItem(this.name+"Cache",JSON.stringify(this));
	}
});