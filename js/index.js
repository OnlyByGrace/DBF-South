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

var AppRouter = Backbone.Router.extend({

});
 
var app = {
	//scroller: null,
	online: true,
	screens: null,
	router: null,
    // Application Constructor
    initialize: function() {
		_.bindAll(this, 'bindEvents','onDeviceReady','register');
		//_.extend(this,Backbone.Events);
		//this.screens = new ScreenModelCollection();
		
		//this.router = new AppRouter();
		//Backbone.history.start();
		
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        //$(document).on('deviceready',this.onDeviceReady);
		//document.addEventListener('deviceready', this.onDeviceReady, false);
		this.onDeviceReady();
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		// this.online = this.checkConnection();
		// $(document).on('offline',this.offlineFunc);
		// $(document).on('online',this.onlineFunc);
	
		var myscroller = new IScroll('#horizontalWrapper', {
            scrollx: true,
            scrolly: false,
            momentum: false,
            snap: true,
            snapspeed: 400,
            //click: true,
            tap: true
            // indicators: {
                // el: document.getElementById('scrollIndicator'),
                // resize: false
            // }
        });
		myscroller.goToPage(0,0);
		
		//app.trigger('deviceready');
    },
	
	checkConnection: function () {
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
			$('#horizontalScroller').append("<div id='"+thisName+"Screen'></div>");
			$('#horizontalScroller').css("width",(this.screens.length*100)+"%");
			$('#scrollIndicator').prepend("<a href='#"+thisName+"'><img src='"+thisIcon+"' /></a>");
			
			this.scroller.refresh();
			
			return ("#"+thisName+"Screen");
		}
		return null;
	}
};
