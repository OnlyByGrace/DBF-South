/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

 // Backbone.sync = function (method, model, options) {
    // options.success();
// }

var ScreenModel = Backbone.Model.extend({
    idAttribute: 'name',
	defaults: {
		'name' : '',
		'icon' : '',
        'el' : '',
        'view' : null
	},

	sync: function () {
	}
});

var ScreenModelCollection = Backbone.Collection.extend({
	model: ScreenModel
});

var ScreenCollectionView = Backbone.View.extend({
	el: '#horizontalWrapper',
	initialize: function (opts) {
		_.bindAll(this,'add','next','prev','goTo','render','touch','release','swipeLeft','swipeRight','drag');
	
        if (opts) {
            if (opts.scrollEl) {
                this.scrollEl = opts.scrollEl;
            }
            
            if (opts.iconTray) {
                this.iconTray = opts.iconTray;
            }
        }
    
		this.collection = new ScreenModelCollection();
        this.currentScreen = 0;
        this.lastPosition = 0;
        
        var options = {
          dragLockToAxis: true,
          dragBlockHorizontal: true
        };
        var hammertime = new Hammer(this.el, options);
        hammertime.on("dragleft dragright", this.drag);
        hammertime.on("swipeleft", this.swipeLeft);
        hammertime.on("swiperight", this.swipeRight);
        hammertime.on("touch", this.touch);
        hammertime.on("release", this.release);
	},
    
    checkSnap: function () {
        this.$el.animate({scrollLeft: Math.round(this.el.scrollLeft / this.el.offsetWidth) *this.el.offsetWidth},200);
    },
    
    drag: function(ev){
        ev.gesture.preventDefault();
        this.$el.scrollLeft(this.lastPosition - ev.gesture.deltaX);
    },
    
    swipeLeft: function(ev){
        this.$el.animate({scrollLeft: this.el.scrollLeft+this.$el.width()},200);
    },
    
    swipeRight: function(ev){
        this.$el.animate({scrollLeft: this.el.scrollLeft-this.$el.width()},200);
    },
    
    touch: function (ev) {
        this.lastPosition = this.el.scrollLeft;
        this.fingerDown = true;
    },
    
    release: function (ev) {
        this.fingerDown = false;
        this.checkSnap();
    },
	
	add: function (model) {
        if (!this.collection.findWhere({name: model.get("name")})) {
            this.collection.add(model);
            model.set("el",encodeURI(model.get("name")+"Screen"));
            
            return model.get("el")
        }
		return null;
	},
	
	next: function () {
        if ((this.collection.length - 1) > this.currentScreen) {
            this.goTo(this.currentScreen+1);
        }
	},
	
	prev: function () {
        if (this.currentScreen > 0) {
            this.goTo(this.currentScreen-1);
        }
	},
	
	goTo: function (screen) {
        var thisModel = this.collection.at(screen);
        if (thisModel) {
            this.$el.scrollLeft($("#"+thisModel.get("el")).position().left);
            this.currentScreen = screen;
        }
	},
    
    render: function () {
        //Add the screens
        var thisEl = $('<div id="horizontalScroller" class="scroller"></div>');
        var that = this;
        thisEl.css("width",(this.collection.length*100)+"%");
        this.collection.each(function (thisModel) {
            var newEl = $('<div id="'+thisModel.get('el')+'" class="wrapper"></div>').css("width",(100/that.collection.length)+"%");
            newEl.append(thisModel.get('view').render());
            thisEl.append(newEl);
            
            //Add the icons - need a default icon
            if (thisModel.get("icon")) {
                $(that.iconTray).append("<a><img src='"+thisModel.get('icon')+"' /></a>");
            }
        });
        this.$el.append(thisEl);
    }
});

var AppRouter = Backbone.Router.extend({
	routes: {
        '' : 'home'
    }
});
 
var app = {
	scroller: null,
	online: true,
	screens: null,
	router: null,
    // Application Constructor
    initialize: function() {
		_.bindAll(this, 'bindEvents','onDeviceReady','register');
		_.extend(this,Backbone.Events);
		
		this.router = new AppRouter();
        this.screens = new ScreenCollectionView({iconTray: "#headerIcons", scrollEl: "#pageIndicator"});
		
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        $(document).on('deviceready',this.onDeviceReady);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		this.online = this.checkConnection();
		$(document).on('offline',this.offlineFunc);
		$(document).on('online',this.onlineFunc);
	
		// this.scroller = new IScroll('#horizontalWrapper', {
            // scrollX: true,
            // scrollY: false,
            // momentum: false,
            // snap: true,
            // snapSpeed: 200,
            ////click: true,
            // tap: true,
            // indicators: {
                // el: document.getElementById('scrollIndicator'),
                // resize: false
            // }
        // }); 
		
		app.trigger('deviceready');
        this.screens.render();
    },
	
	checkConnection: function () {
		if (navigator.connection) {
			var networkState = navigator.connection.type;
			if (networkState == navigator.connection.NONE) {
				return false;
			} else {
				return true;
			}
		}
		
		return false;
	},
	
	offlineFunc: function () {
		app.online = false;
	},
	
	onlineFunc: function () {
		app.online = true;
	},
	
	register: function (thisController) {
		return this.screens.add(new ScreenModel({'name': thisController.displayName, 'icon': thisController.icon, 'view' : thisController}));
	}
};
