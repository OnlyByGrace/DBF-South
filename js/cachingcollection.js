var CacheModel = Backbone.Model.extend({
    defaults: {
        version: '1.0',
        date: null,
        data: null
    }
});

var CachingCollection = Backbone.Collection.extend({
	lastUpdate: null,
	initialize: function (models,opts) {
		_.bindAll(this,'loadCache','loadLive','sync','save');
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
        if (items) {
            if (!items.version) {
                items.version = "0"
            }
            
            switch (items.version) {
                case "0":
                    this.lastUpdate = "unknown";
                    this.set(items);
                    break;
                case "1.0":
                    this.lastUpdate = new Date(items.date);
                    this.set(items.data);
                    break;
                default:
                    throw "Unknown cache version";
                    break;
            }
        } else {
            this.lastUpdate = "never";
        }
	},
	
	loadLive: function (options) {
		$.ajax({ context: this,
			type: 'GET',
			url: this.url,
			cache: false})
			.fail(function () {
                console.log("failure");
                if (options.errorCallback) {
                    options.errorCallback();
                }
			})
			.done(function (data, textStatus, jqXHR) {
                //console.log(data);
                //console.log(JSON.stringify(jqXHR));
				this.complete(data);
				options.successCallback();
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
			//console.log("loading cache");
			this.loadCache();
		}
        
        if (this.offline == true) {
            options.successCallback();
            return;
        }
		
        //console.log(app.online);
		if ((app.online == true) && this.url) {
			this.loadLive(options);
		} else {
			if (options.errorCallback) {
				options.errorCallback();
			}
		}
	},
	
	save: function () {
        var newCache = new CacheModel({date: new Date(), data: this});
		window.localStorage.setItem(this.name+"Cache",JSON.stringify(newCache));
	}
});

var CachingCollectionView = Backbone.View.extend({
	displayName: '',
	icon: '',
	events: {
	//	'scroll': 'onScroll'
	},
	initialize: function (opts) {
		_.bindAll(this, 'itemAdded', 'refresh', 'render', 'onDeviceReady', 'onCollectionLoaded', 'onCollectionError','onScroll','initializeScroller');
	
		if (!this.collection) {
			throw "No collection specified";
		}
		
		if (opts) {
			if (opts.displayName) {
				this.displayName = opts.displayName;
			}
			
			if (opts.icon) {
				this.icon = opts.icon;
			}
		}
		
		this.collection = new this.collection([],{name:this.displayName});
		
		//var tempEl = app.register(this.displayName,this.icon);
		//console.log(tempEl);
		//this.initializeScroller(tempEl);
        this.adjusting = false;
		
		this.listenTo(this.collection,"add",this.itemAdded);
		this.listenTo(app,"deviceready",this.onDeviceReady);
        
        this.init();
		
		this.render();
	},
    
    /* Shoudl be overwritten */
    init: function () {
    },
	
	/* Should be overwritten */
	itemAdded: function () {
	},
	
	refresh: function () {
		//this.scroller.refresh();
	},
	
	onDeviceReady: function () {
		this.$el.prepend("<div class='loadingbanner' style='width:100%'>Loading...</div>");
		this.collection.fetch({successCallback: this.onCollectionLoaded, errorCallback: this.onCollectionError});
	},
	
	onCollectionLoaded: function () {
		this.$el.children('.loadingbanner').remove();
	},
	
	onCollectionError: function () {
		this.$el.children('.loadingbanner').remove();
        var lastUpdated = "never";
        
        if (this.collection.lastUpdate) {
            var d = this.collection.lastUpdate;
            if (d.toLocaleDateString) {
                lastUpdated = d.toLocaleDateString();
                //lastUpdated = d.getDay()+"/"+d.getMonth()+"/"+d.getFullYear()+" at "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
            }
        }
        
		this.$el.prepend("<div class='offlinebanner' style='width:100%'>Last updated "+lastUpdated+"</div>");
	},
	
	render: function () {
        if (this.$el.html() == "") {
            this.$el.html("<h6>"+this.displayName+"</h6>");
        }
		var that = this;
		//setTimeout(function () { that.el.scrollTop = 100},250);
        return this.el;
	},
	
	initializeScroller: function (tempEl) {
		//$(tempEl).append("<div class='scroller'></div>");
		
		//$(tempEl).prepend("<div style='height:100px'></div>");
		this.setElement($(tempEl));
		//console.log(this.$el);
		//this.scroller = new IScroll(tempEl);
	},
	
	onScroll: function () {
        if (this.adjusting == true) {
            return;
        }
		//console.log(this.displayName);
		if (this.el.scrollTop < 50) {
			var that = this;
            this.adjusting = true;
			//setTimeout(function () { that.el.scrollTop = 100},10);
			this.$el.animate({scrollTop: 50},200, function () {that.adjusting = false});
			setTimeout(that.onScroll,150);
		}
	}
});