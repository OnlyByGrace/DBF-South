describe("Caching Collection",function () {
	beforeEach(function () {
		thisCollection = new CachingCollection([],{name: "test"});
		thisCollection.name = "base";
		thisCollection.url = "filler";
	});
	
	afterEach(function () {
		
	});
	
	describe("initialize", function () {
		it("should have a name set", function () {
			expect(thisCollection.name).toBeDefined();
		});
		
		it("should have a url set", function () {
			expect(thisCollection.url).toBeDefined();
		});
	});
	
	describe("fetch", function () {
		it("should throw an exception of no name is set", function () {
			var errorThrown = false;
			delete thisCollection.name;
			try {
				thisCollection.fetch();
			} catch (err) {
				errorThrown = true;
			}
			expect(errorThrown).toBe(true);
		});
	
		it("should load cache first", function () {
			var thisModel = {title: "Testing"};
			window.localStorage.setItem("baseCache",JSON.stringify(thisModel));
			thisCollection.fetch();
			expect(thisCollection.pluck("title")).toEqual(["Testing"]);
			window.localStorage.removeItem("baseCache");
		});
		
		it("should not load cache if collection already has items", function () {
			thisCollection.add({title: "Testing"});
			var thisModel = {title: "Testing2"};
			window.localStorage.setItem("baseCache",JSON.stringify(thisModel));
			thisCollection.fetch();
			expect(thisCollection.pluck("title")).toEqual(["Testing"]);
			window.localStorage.removeItem("baseCache");
		});
		
		it("should load online if the app is online, firing appropriate callbacks", function () {
			var successCalled = false;
			var errorCalled = false;
			var options = {
				success: function (data) {
					successCalled = true;
				},
				error: function () {
					errorCalled = true;
				}
			}
			spyOn(thisCollection,'loadLive').andCallFake(function (options) {
				thisCollection.success();
				options.success();
				
				options.error();
			});
			app.online = true;
			thisCollection.fetch(options);
			expect(thisCollection.loadLive).toHaveBeenCalled();
			expect(successCalled).toBe(true);
			expect(errorCalled).toBe(true);
		});
		
		it("should call error callback if app is offline", function () {
			var called = false;
			var options = {
				error: function () {
					called = true;
				}
			}
			runs(function () {
				app.online = false;
				thisCollection.fetch(options);
			});
			
			waitsFor(function () {
				return (called);
			},"error callback should be fired", 500);
			
			runs(function () {
				expect(called).toBe(true);
			});			
		});
		
		it("should call error callback if no url is specified", function () {
			var called = false;
			var options = {
				error: function () {
					called = true;
				}
			}
			runs(function () {
				spyOn(thisCollection,'loadLive');
				delete thisCollection.url;
				app.online = true;
				thisCollection.fetch(options);
			});
			
			waitsFor(function () {
				return (called);
			},"error callback should be fired", 500);
			
			runs(function () {
				expect(called).toBe(true);
			});			
		});
	});
	
	describe("save", function () {
		it("should set the cache", function () {
			var thisModel = {title: "Testing"};
			thisCollection.add(thisModel);
			thisCollection.save();
			
			var temp = JSON.parse(window.localStorage.getItem(thisCollection.name+"Cache"));
			expect(temp).toEqual([thisModel]);
		});
		
		it("should fire on model add", function () {
			var thisModel = {title: "Testing"};
			thisCollection.add(thisModel);
			
			var temp = JSON.parse(window.localStorage.getItem(thisCollection.name+"Cache"));
			expect(temp).toEqual([thisModel]);
		});
		
		it("should fire on model remove", function () {
			var thisModel = {title: "Testing"};
			thisCollection.add(thisModel);
			thisCollection.remove(thisCollection.at(0));
			
			var temp = JSON.parse(window.localStorage.getItem(thisCollection.name+"Cache"));
			expect(temp).toEqual([]);
		});
		
		it("should fire on collection reset", function () {
			var thisModel = {title: "Testing"};
			thisCollection.add(thisModel);
			thisCollection.reset();
			
			var temp = JSON.parse(window.localStorage.getItem(thisCollection.name+"Cache"));
			expect(temp).toEqual([]);
		});
	});
});

describe("CachingCollection View", function () {
	
	beforeEach(function () {
		$('body').append("<div id='stage'></div>");
	});
	
	afterEach(function () {
		$('#stage').remove();
	});
	
	describe("initialize", function () {
		it("should throw an error of no collection is specified", function () {
			var error = false;
			try {
				var thisView = new CachingCollectionView();
			} catch (err) {
				var error = true;
			}
			
			expect(error).toBe(true);
		});
		
		it("should register with app with displayName", function() {
			spyOn(app,'register').andReturn("#stage");
			var thisView = new CachingCollectionView({collection: new NewsCollection(), displayName: "Test", icon: ""});
			expect(app.register).toHaveBeenCalledWith("Test",thisView.icon);
		});
		
		it("should setup the scroller", function () {
			spyOn(app,'register').andReturn("#stage");
			var thisView = new CachingCollectionView({collection: new NewsCollection()});
			expect(thisView.scroller).toBeTruthy();
		});
		
		it("should render", function () {
			spyOn(app,'register').andReturn("#stage");
			var thisView = new CachingCollectionView({collection: new NewsCollection(), displayName: "Test"});
			expect(thisView.$el.html()).toBe("<h6>"+thisView.displayName+"</h6>");
		});
	});
	
	describe("refresh", function () {
		it("should refresh the scroller", function () {
			spyOn(app,'register').andReturn("#stage");
			var thisView = new CachingCollectionView({collection: new NewsCollection(), displayName: "Test"});
			spyOn(thisView.scroller, 'refresh');
			thisView.refresh();
			
			expect(thisView.scroller.refresh).toHaveBeenCalled();
		});
	});
	
	describe("onDeviceReady", function () {
		it("should add a loading banner", function () {
			
		});
		
		it("should fetch collection items", function () {
		
		});
	});
	
	describe("onCollectionLoaded", function () {
		it("should remove the loading banner", function () {
		
		});
	});
	
	describe("onCollectionError", function () {
		it("should place the loading banner with a last updated banner", function () {
		
		});
	});
});