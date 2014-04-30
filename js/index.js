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
	defaults: {
		'name':'',
		'icon':''
	},
	
	sync: function () {
	}
});

var ScreenModelCollection = Backbone.Collection.extend({
	model: ScreenModel
});

var ScreenCollectionView = Backbone.View.extend({
	el: '#outerWrapper',
	initialize: function () {
		_.bindAll(this,'add','next','prev','goTo');
	
		this.collection = new ScreenModelCollection();
		this.currentScreen = 0;
	},
	
	add: function (model) {
		this.collection.add(model);
	},
	
	next: function () {
		
	},
	
	prev: function () {
	},
	
	goTo: function (screen) {
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
		this.screens = new ScreenModelCollection();
		
		this.router = new AppRouter();
		
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
	
		this.scroller = new IScroll('#horizontalWrapper', {
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: true,
            snapSpeed: 200,
            // click: true,
            tap: true,
            indicators: {
                el: document.getElementById('scrollIndicator'),
                resize: false
            }
        }); 
		
		app.trigger('deviceready');
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
	
	register: function (thisName, thisIcon) {
		//thisName must be unique
		if (!this.screens.findWhere({name:thisName})) {
			this.screens.add(new ScreenModel({'name': thisName, 'icon': thisIcon}));
			this.router.route(thisName,thisName);
			$('#horizontalScroller').append("<div id='"+thisName+"Screen' class='wrapper'></div>");
			$('#horizontalScroller').css("width",(this.screens.length*100)+"%");
			$('#scrollIndicator').before("<a href='#"+thisName+"'><img src='"+thisIcon+"' /></a>");
			
			$('div.wrapper').css("width",(100/this.screens.length)+"%");
			//console.log((100/this.screens.length)+"%");
			
			if (this.scroller) {
				setTimeout(function () {
					app.scroller.refresh();
				}, 10);
			}
			
			return ("#"+thisName+"Screen");
		}
		return null;
	}
};
