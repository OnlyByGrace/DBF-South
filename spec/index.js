describe("ScreenModel", function () {
	it('should override sync', function () {
		var thisModel = new ScreenModel();
		expect(thisModel.sync).toBeDefined();
	});
});

describe("app", function () {
	describe('initialize', function() {
        // it('should bind deviceready', function() {
            // runs(function() {
                // spyOn(app,'onDeviceReady');
				// app.initialize();
				// $(document).trigger('deviceready');
            // });	

            // waitsFor(function() {
                // return (app.onDeviceReady.calls.len1gth > 0);
            // }, 'onDeviceReady should be called once', 500);

            // runs(function() {
                // expect(app.onDeviceReady).toHaveBeenCalled();
            // });
        // });
		
		it('should extend itself with Backbone Events', function () {
			app.initialize();
			expect(app.trigger).toBeDefined();
		});
		
		it('should create a new ScreenModelCollection', function () {
			app.initialize();
			expect(app.screens).toEqual(jasmine.any(ScreenModelCollection));
		})
		
		it('should initialize the router', function () {
			app.initialize();
			expect(app.router).toEqual(jasmine.any(AppRouter));
		});
    });
	
	describe('onDeviceReady', function() {
		beforeEach(function() {
			$('body').append("<div id='stage'></div>");
			var el = $('#stage');
			el.append("<div id='scrollIndicator'><div></div></div><div id='horizontalWrapper'><div></div></div>");
        });
		
		afterEach(function() {
			$('#stage').remove();
		});
	
        it('should report that it fired', function() {
			spyOn(app, 'trigger');
            app.onDeviceReady();
			expect(app.trigger).toHaveBeenCalledWith('deviceready');
			app.scroller.destroy();
        });
		
		describe('should set the app connection state', function () {
			it("to online if there is a connection", function () {
				spyOn(app,'checkConnection').andReturn(false);
				app.onDeviceReady();
				expect(app.checkConnection).toHaveBeenCalled();
				expect(app.online).toBe(false);
				app.scroller.destroy();
			});
			
			it("to offline if there is no connection", function () {
				spyOn(app,'checkConnection').andReturn(true);
				app.onDeviceReady();
				expect(app.checkConnection).toHaveBeenCalled();
				expect(app.online).toBe(true);
				app.scroller.destroy();
			});
		});
		
		it('should bind offline event', function () {
			runs(function () {
				spyOn(app,"offlineFunc");
				app.onDeviceReady();
				$(document).trigger('offline');
			});
			
			waitsFor(function () {
				return (app.offlineFunc.calls.length > 0);
			}, "offline method should trigger", 500);
			
			runs(function () {
				expect(app.online).toBe(false);
				app.scroller.destroy();
			});
		});
		
		it('should bind online event', function () {
			runs(function () {
				app.online = false;
				spyOn(app,'onlineFunc');
				app.onDeviceReady();
				$(document).trigger('online');
			});
			
			waitsFor(function () {
				return (app.onlineFunc.calls.length > 0);
			},"online method should trigger",500);
			
			runs(function () {
				expect(app.online).toBe(true);
				app.scroller.destroy();
			});
		});
		
		it('should create the horizontal scroller', function() {
            app.onDeviceReady();
			expect(app.scroller).toBeTruthy();
			app.scroller.destroy();
        });
	});

	describe('register', function () {
		beforeEach(function() {
			$('body').append("<div id='stage'></div>");
			var el = $('#stage');
			el.append("<div id='scrollIndicator'><div></div></div><div id='horizontalWrapper'><div id='horizontalScroller'></div></div>");
        });
		
		afterEach(function() {
			$('#stage').remove();
		});
	
		it('should create a new app screen model', function () {
			app.initialize();
			app.onDeviceReady();
			app.register("news","images/calendar.png");
			expect(app.screens.at(0).attributes).toEqual(new ScreenModel({name:"news",icon:'images/calendar.png'}).attributes);
		});
		
		it('should add a route to the rounter', function () {
			var called = false;
			//expect(app.router.routes["news"]).toBeDefined();
			runs(function () {
				app.initialize();
				app.onDeviceReady();
				app.register("news","images/calendar.png");
				app.router.on('route:news', function () {
					//console.log("test");
					called = true;
				});
				if (!Backbone.History.started) {
					Backbone.history.start();
				}
				
				app.router.navigate("news");
			});
			
			waitsFor(function () {
				return (called == true);
			}, "route callback should be fired", 500);
			
			runs(function () {
				expect(called).toBe(true);
			});
		});
		
		it('should return a dom element', function () {
			app.initialize();
			app.onDeviceReady();
			var test = app.register('news','images/calendar.png');
			expect(test).toBe('#newsScreen');
		});
		
		it('should resize and refresh the horizontal scroller', function () {	
			app.initialize();
			app.onDeviceReady();
			var test = app.register('news','images/calendar.png');
			expect($('#horizontalScroller').css("width")).toBe($('body').css("width"));
		});
		
		//it should add an icon in the header bar
	});
});