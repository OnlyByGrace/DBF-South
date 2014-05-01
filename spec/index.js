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
			window.Connection = { NONE : 0, ELSE : 1};
			navigator.connection = {};
			navigator.connection.type = Connection.NONE;
			$('body').append("<div id='stage'></div>");
			var el = $('#stage');
			el.append("<div id='scrollIndicator'><div></div></div><div id='horizontalWrapper'><div></div></div>");
        });
		
		afterEach(function() {
			$('#stage').remove();
			window.Connection = null;
			navigator.connection = null;
		});
	
        it('should report that it fired', function() {
			spyOn(app, 'trigger');
            app.onDeviceReady();
			expect(app.trigger).toHaveBeenCalledWith('deviceready');
			//app.scroller.destroy();
        });
		
		describe('should set the app connection state', function () {
			it("to online if there is a connection", function () {
				spyOn(app,'checkConnection').andReturn(false);
				app.onDeviceReady();
				expect(app.checkConnection).toHaveBeenCalled();
				expect(app.online).toBe(false);
				//app.scroller.destroy();
			});
			
			it("to offline if there is no connection", function () {
				spyOn(app,'checkConnection').andReturn(true);
				app.onDeviceReady();
				expect(app.checkConnection).toHaveBeenCalled();
				expect(app.online).toBe(true);
				//app.scroller.destroy();
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
				//app.scroller.destroy();
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
				//app.scroller.destroy();
			});
		});
		
        //REMOVED iSCROLL
		// it('should create the horizontal scroller', function() {
            // app.onDeviceReady();
			// expect(app.scroller).toBeTruthy();
			//app.scroller.destroy();
        // });
	});

	describe('register', function () {
		beforeEach(function() {
			window.Connection = { NONE : 0, ELSE : 1};
			navigator.connection = {};
			navigator.connection.type = Connection.NONE;
			$('body').append("<div id='stage'></div>");
			var el = $('#stage');
			el.append("<div id='scrollIndicator'><div></div></div><div id='horizontalWrapper'><div id='horizontalScroller'></div></div>");
        });
		
		afterEach(function() {
			$('#stage').remove();
			window.Connection = null;
			navigator.connection = null;
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

describe("ScreenCollectionViewer", function () {
    beforeEach(function () {
        $('body').append("<div id='stage'></div>");
		var el = $('#stage');
		el.append("<div id='scrollIndicator'><div id='headerIcons'></div></div><div id='horizontalWrapper'><div></div></div>");
    });

    afterEach(function () {
        $('#stage').remove();
    });
    
    describe("initialize", function () {
        it("should be bound to #horizontalWrapper", function () {
            var thisView = new ScreenCollectionView();
            expect(thisView.el.id).toBe("horizontalWrapper");
        });
        
        it("should bind an icon tray", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons"});
            expect($(thisView.iconTray).attr('id')).toBe("headerIcons");
        });
        
        it("should bind a scroll indicator if provided", function () {
            var thisView = new ScreenCollectionView({scrollEl: "#scrollIndicator"});
            expect($(thisView.scrollEl).attr('id')).toBe("scrollIndicator");
        });
    });
    
    describe("add", function () {
        it("should add a model to the collection", function () {
            var thisView = new ScreenCollectionView();
            
            thisView.add(new ScreenModel({name: "test"}));
            
            expect(thisView.collection.at(0).get("name")).toBe("test");
        });
        
        it("should add an icon to the iconTray", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons"});
            expect($(thisView.iconTray).children('a').length).toBe(0);
            thisView.add(new ScreenModel({name: "test", icon: "test.png"}));
            console.log($(thisView.iconTray).html());
            expect($(thisView.iconTray).children('a').length).toBe(1);
        });
        
        it("should add an element to child 1", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons"});
            expect($(thisView.$el.children()[0]).children().length).toBe(0);
            thisView.add(new ScreenModel({name: "test", icon: "test.png"}));
            expect($(thisView.$el.children()[0]).children().length).toBe(1);
        });
        
        it("should expand the width of child 1", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons"});
            var firstWidth = $(thisView.$el.children(":first")).width();
            thisView.add(new ScreenModel({name: "test", icon: "test.png"}));
            thisView.add(new ScreenModel({name: "test2", icon: "test.png"}));
            expect(firstWidth).toBeLessThan($(thisView.$el.children(":first")).width());
        });
        
        it("should update screen widths", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons"});
            thisView.add(new ScreenModel({name: "test", icon: "test.png"}));
            var firstWidth = $(".wrapper:first").width();
            thisView.add(new ScreenModel({name: "test2", icon: "test.png"}));
            expect(firstWidth).toBe($(".wrapper:first").width());
        });
        
        it("should return the element id", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons"});
            var returnVal = thisView.add(new ScreenModel({name: "test", icon: "test.png"}));
            expect(returnVal).toBe("#testScreen");
        });
        
        it("should not permit duplicates", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons"});
            thisView.add(new ScreenModel({name: "test", icon: "test.png"}));
            expect(thisView.add(new ScreenModel({name: "test", icon: "test.png"}))).toBeFalsy();
            expect(thisView.collection.length).toBe(1);
        });
    });
    
    describe('next',function () {
        it("should call goTo with the next element", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons", scrollEl: "#scrollIndicator"});
            spyOn(thisView, 'goTo');
            thisView.add(new ScreenModel({name: "test", icon: "test.png"}));
            thisView.add(new ScreenModel({name: "test1", icon: "test.png"}));
            thisView.next();
            expect(thisView.goTo).toHaveBeenCalledWith(1);
        });
        
        it("should not call goTo if last screen displayed", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons", scrollEl: "#scrollIndicator"});
            spyOn(thisView, 'goTo');
            thisView.add(new ScreenModel({name: "test", icon: "test.png"}));
            thisView.next();
            expect(thisView.goTo).not.toHaveBeenCalled();
        });
    });
    
    describe('prev',function () {
        it("should call goTo with the prev element", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons", scrollEl: "#scrollIndicator"});
            spyOn(thisView, 'goTo').andCallThrough();
            thisView.add(new ScreenModel({name: "test", icon: "test.png"}));
            thisView.add(new ScreenModel({name: "test1", icon: "test.png"}));
            thisView.next();
            thisView.prev();
            expect(thisView.goTo).toHaveBeenCalledWith(0);
        });
        
        it("should not call goTo if last screen displayed", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons", scrollEl: "#scrollIndicator"});
            spyOn(thisView, 'goTo');
            thisView.add(new ScreenModel({name: "test", icon: "test.png"}));
            thisView.prev();
            expect(thisView.goTo).not.toHaveBeenCalled();
        });
    });
    
    describe('goTo', function () {
        it("should set el.scrollLeft to the left of # screen", function () {
            var thisView = new ScreenCollectionView({iconTray: "#headerIcons", scrollEl: "#scrollIndicator"});
            thisView.add(new ScreenModel({name: "test", icon: "test.png"}));
            thisView.add(new ScreenModel({name: "test1", icon: "test.png"}));
            spyOn(thisView.$el,'scrollLeft');
            $("#test1Screen").css("position","absolute");
            thisView.goTo(1);
            console.log($('#stage').html());
            expect(thisView.$el.scrollLeft).toHaveBeenCalled();
        });
    });
});