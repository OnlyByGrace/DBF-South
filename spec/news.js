
var sampleData = '<?xml version="1.0" encoding="utf-8"?> \
<!-- generator="Joomla! - Open Source Content Management" --> \
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"> \
	<channel> \
		<title>Delhi Bible Fellowship South</title> \
		<description><![CDATA[Delhi Bible Fellowship South]]></description> \
		<link>http://dbfsouth.org/latest-updates</link> \
		<lastBuildDate>Tue, 22 Apr 2014 13:42:08 +0530</lastBuildDate> \
		<generator>Joomla! - Open Source Content Management</generator> \
		<atom:link rel="self" type="application/rss+xml" href="http://dbfsouth.org/component/content/category/35-latest-updates/latest-updates?format=feed&amp;type=rss"/> \
		<language>en-gb</language> \
		<item> \
			<title>Easter Sunday Service 2014</title> \
			<link>http://dbfsouth.org/latest-updates/103-easter-sunday-service-2014</link> \
			<guid isPermaLink="true">http://dbfsouth.org/latest-updates/103-easter-sunday-service-2014</guid>\
			<description><![CDATA[<div class="feed-description"><p><img class="img-responsive" src="http://dbfsouth.org/images/HE IS RISEN.png" border="0" alt="" align="left" /></p> \
<p> </p></div>]]></description> \
			<author>timothysingh@yahoo.com (Timothy Singh)</author> \
			<category>Latest Updates</category> \
			<pubDate>Fri, 18 Apr 2014 14:12:44 +0530</pubDate> \
		</item> \
		<item> \
			<title>Good Friday and Resurrection Sunday Services</title> \
			<link>http://dbfsouth.org/latest-updates/93-good-friday-and-resurrection-sunday-services</link> \
			<guid isPermaLink="true">http://dbfsouth.org/latest-updates/93-good-friday-and-resurrection-sunday-services</guid> \
			<description><![CDATA[<div class="feed-description"><p>Good Friday and Resurrection Sunday are nearly upon us, and they bring with them some changes to the normal schedule at SDC. First, there will be a special Good Friday service on March 29th at 10:30am at the normal Sat Pal Mittal Centre. Second, on the following Sunday there will be one combined service at 10:30am instead of the usual 9 and 11 o\'clock services. Everyone is invited to stay back for a fellowship lunch after the service.</p> \
<p>Invite your friends and neighbors and join us for these special services!</p> \
<p>These and other weekly events can always be found on the church <a href="http://dbfsouth.org/calendar">calendar.</a></p></div>]]></description> \
			<author>programmerbygrace@gmail.com (Administrator)</author> \
			<category>Latest Updates</category> \
			<pubDate>Tue, 12 Mar 2013 16:37:05 +0530</pubDate> \
		</item> \
		<item> \
			<title>Pardon our dust!</title> \
			<link>http://dbfsouth.org/latest-updates/89-pardon-our-dust</link> \
			<guid isPermaLink="true">http://dbfsouth.org/latest-updates/89-pardon-our-dust</guid> \
			<description><![CDATA[<div class="feed-description"><p>Welcome to the new Delhi Bible Fellowship, South Delhi Congregation website! Over the next few weeks we will be continually working to bring the site up to date with the latest news and resources from SDC. In the meantime, please bear with any broken features or missing information that you may (or may not!) find. We hope you find the new site useful!</p></div>]]></description> \
			<author>programmerbygrace@gmail.com (Administrator)</author> \
			<category>Latest Updates</category> \
			<pubDate>Thu, 24 Jan 2013 05:28:55 +0530</pubDate> \
		</item> \
	</channel> \
</rss>';

var newsTemplate = '<script id="entry-template" type="text/x-handlebars-template"> \
        <h5>{{title}}</h5> \
        <p class="entry-text"> \
            {{{content}}} \
        </p> \
    </script>';

// '<script id="news-template" type="text/x-handlebars-template"> \
        // <div id="newsWrapper" class="wrapper"> \
            // <div id="newsScroller" class="scroller"> \
                // <h5>{{title}}</h5> \
                // <p class="news-text"> \
                    // {{content}} \
                // </p> \
            // </div> \
        // </div> \
    // </script>';


describe("News Section", function () {

	describe("news model", function () {
		var thisModel = {};

		beforeEach(function () {
			thisModel = new NewsModel();
		});

		describe("initialization", function () {
			it("should have default content", function () {
				expect(thisModel.get('title')).toBeDefined();
				expect(thisModel.get('content')).toBeDefined();
				expect(thisModel.get('date')).toBeDefined();
			});
			
			it("should override sync", function () {
				expect(thisModel.sync).toBeDefined();
			});
		});
	});

	describe("news view", function () {
		var thisView = {};
	
		beforeEach(function() {
			$('body').append("<div id='stage'></div>");
			$('#stage').append(newsTemplate);
			var thisModel = new NewsModel({title: "Test", content: "This is a test"});			
			thisView = new NewsModelView({model: thisModel});
		});
		
		afterEach(function () {
			$('#stage').remove();
		});
		
		describe("initialization", function () {
			it("should have a model specified", function () {
				expect(thisView.model).toBeDefined();
			});
			
			it("should setup the template", function () {
				expect(thisView.template).toBeTruthy();
			});
		});
		
		describe("render", function () {
			it("should return the element", function () {
				expect(thisView.render()).toBeTruthy();
			});
		});
		
		describe("unrender", function () {
			it("should remove its element when the model is destroyed", function () {
				spyOn(thisView, 'remove');
				thisView.model.destroy();
				expect(thisView.remove).toHaveBeenCalled();
			});
		});
	});
	
	describe("news collection", function () {
		var thisCollection = {};
		
		beforeEach(function () {
			thisCollection = new NewsCollection();
		});
	
		describe("initialization", function () {
			it("should override sync", function () {
				expect(thisCollection.sync).toBeDefined();
			});
		});
		
		describe("adding", function () {
			it("should add items with via news model", function () {
				var thisModel = {title: "test"};
				thisCollection.add(thisModel);
				expect(thisCollection.at(0).attributes.date).toBe('');
			});
		});
		
		describe("loading", function () {
			it("if collection is not empty, do not load cache", function () {
				var thisModel = new NewsModel({title: "Test", content: "This is a test"});
				var previousModel = new NewsModel({title: "Test1", content: "This is a test"});
				
				runs(function () {
					thisCollection.add(previousModel);
					window.localStorage.setItem("newsCache",JSON.stringify(new CacheModel({date: new Date(), data: thisModel})));
					spyOn(thisCollection,"sync").andCallThrough();
					thisCollection.fetch();
				});
				
				waitsFor(function () {
					return (thisCollection.sync.calls.length > 0)
				},"collection should load from cache", 500);
				
				runs(function () {
					expect(thisCollection.at(0).attributes).toEqual(previousModel.attributes);
					window.localStorage.removeItem("newsCache");
				});
			});
			it("if collection is empty, should first check for a cache in local storage", function () {
				var thisModel = new NewsModel({title: "Test", content: "This is a test"});
				
				runs(function () {
					window.localStorage.setItem("newsCache",JSON.stringify(new CacheModel({date: new Date(), data: thisModel})));
					thisCollection.fetch();
				});
				
				waitsFor(function () {
					return (thisCollection.length > 0)
				},"collection should load from cache", 500);
				
				runs(function () {
					expect(thisCollection.at(0).attributes).toEqual(thisModel.attributes);
					window.localStorage.removeItem("newsCache");
				});
			});
			
			it("if app is online, attempt online load", function () {
				var called = true;
				runs(function () {
					app.online = true;
					
					spyOn(thisCollection,'loadLive').andCallFake(function () {
						thisCollection.complete(sampleData);
						called = true;
					});
					thisCollection.fetch();
				});
				
				waitsFor(function () {
					return (thisCollection.loadLive.calls.length > 0);
				}, "loadLive should have been called", 500);
				
				runs(function () {
					//console.log(thisCollection.toJSON());
					expect(thisCollection.pluck("title")).toEqual(["Easter Sunday Service 2014","Good Friday and Resurrection Sunday Services","Pardon our dust!"]);
					//console.log(thisCollection.pluck("date"));
					expect(called).toBe(true);
				});
			});
			
			it("if app is offline, immediately call error callback", function () {
				var called = false;
				var options = {
					successCallback: function () {
						called = true;
					},
					errorCallback: function () {
						called = true;
					}
				};
				runs(function () {
					app.online = false;
					
					thisCollection.fetch(options);
				});
				
				waitsFor(function () {
					return (called == true);
				}, "sync should have been called with callbacks", 500);
				
				runs(function () {
					expect(called).toBe(true);
				});
			});
		});
	});
	
	describe("news collection view", function () {
		var thisCollection = {};
		
		beforeEach(function () {
			$('body').append("<div id='stage'></div>");
			var el = $('#stage');
			window.Connection = { NONE : 0, ELSE : 1};
			navigator.connection = {};
			navigator.connection.type = Connection.NONE;
			el.append("<div id='scrollIndicator'><div></div></div><div id='horizontalWrapper'><div id='horizontalScroller'></div></div>");
			el.append(newsTemplate);
			
			app.initialize();
			//app.onDeviceReady();
			thisCollection = new NewsCollectionView();
		});
		
		afterEach(function () {
			$('#stage').remove();
			window.Connection = null;
			navigator.connection = null;
		});
		
		describe("initialization", function () {
			it("should initialize a new NewsCollection", function () {
				expect(thisCollection.collection).toEqual(jasmine.any(NewsCollection));
			});
			
			it("should register with the app to get a DOM element", function () {
				expect(thisCollection.el).toBeTruthy();
			});
			
			// it("should add a scroller element and initialize scroller", function () {
				// expect(thisCollection.scroller).toBeTruthy();
			// });
			
			it("should render", function () {
				expect(thisCollection.$el.html()).toBeTruthy();
				expect(thisCollection.el).toBeTruthy();
			});
		});
		
		describe("deviceReady", function () {
			it("should fetch collection items on app.deviceready", function () {
				runs(function () {
					spyOn(thisCollection.collection,"fetch");
					thisCollection.onDeviceReady();
					//app.trigger("deviceready");
				});
				
				waitsFor(function() {
					return (thisCollection.collection.fetch.calls.length > 0 );
				},"fetch should be called once", 500);
				
				runs(function () {
					expect(thisCollection.collection.fetch).toHaveBeenCalled();
				});
			});
		});
		
		describe("loading", function () {
			it("should display a loading banner when there is a pending fetch", function () {
				runs(function () {
					spyOn(thisCollection.collection,'fetch');
					thisCollection.onDeviceReady();
					//app.trigger('deviceready');
				});
				
				waitsFor(function () {
					return (thisCollection.collection.fetch.calls.length > 0);
				},"device ready should fire fetch", 500);
				
				runs(function () {
					expect(thisCollection.$el.children('.loadingbanner').length).toBeTruthy();
					thisCollection.onCollectionLoaded();
					expect(thisCollection.$el.children('.loadingbanner').length).toBeFalsy();
				});
			});
			
			it("should display an offline banner when there is a no connection", function () {
				runs(function () {
					app.online = false;
					spyOn(thisCollection.collection,'fetch');
					thisCollection.onDeviceReady();
					//app.trigger('deviceready');
				});
				
				waitsFor(function () {
					return (thisCollection.collection.fetch.calls.length > 0);
				},"device ready should fire fetch", 500);
				
				runs(function () {
					expect(thisCollection.$el.children('.loadingbanner').length).toBeTruthy();
					thisCollection.onCollectionError();
					expect(thisCollection.$el.children('.loadingbanner').length).toBeFalsy();
					expect(thisCollection.$el.children('.offlinebanner').length).toBeTruthy();
				});
			});
		});
		
		describe("itemAdded", function () {
			it("should render a new NewsModelView", function () {
				spyOn(thisCollection.$el,'append');
				var thisModel = new NewsModel({title: "Test", content: "This is a test"});
				thisCollection.collection.add(thisModel);
				expect(thisCollection.$el.append).toHaveBeenCalled();
			});
			
			// REMOVED iSCROLL
			// it("should refresh the scroller", function() {
				// spyOn(thisCollection.scroller,'refresh');
				// var thisModel = new NewsModel({title: "Test", content: "This is a test"});
				// thisCollection.collection.add(thisModel);
				// expect(thisCollection.scroller.refresh).toHaveBeenCalled();
			// });
		});
	});
});	