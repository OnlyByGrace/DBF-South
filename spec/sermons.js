var sermonPopupTemplate = '<script id="sermon-popup-template" type="text/x-handlebars-template"> \
    <div class="sermonPopupContent"> \
        <h3>{{title}}</h3><br /> \
        {{speaker}}<br />{{date}}<br />{{length}} \
    </div></script>';

describe("Sermons Section", function () {
	describe("sermon model", function () {
		it("should override sync", function () {
			var thisModel = new SermonModel();
			expect(thisModel.sync).toBeTruthy();
		});
	});
});
/* DON'T KNOW HOW TO TRIGGER TAP
describe("SermonModelView", function () {
    it("should navigate when tapped", function () {
        $('body').append("<div id='stage'></div>");
        var el = $('#stage');
        el.append(sermonPopupTemplate);
    
        var thisView = new SermonModelView({template: "sermon-popup-template"});
        spyOn(app.router,'navigate');
        thisView.trigger('tap');
        expect(app.router.navigate).toHaveBeenCalled();
        
        $('#stage').remove();
    })
});*/

describe("SermonCollectionView", function () {
    beforeEach(function () {
        $('body').append("<div id='stage'></div>");
        var el = $('#stage');
        el.append("<div id='scrollIndicator'><div></div></div><div id='horizontalWrapper'><div></div></div>");
        el.append(sermonPopupTemplate);
    });
    
    afterEach(function () {
        $('#stage').remove();
    });

    describe("init", function () {
        it("should override init", function () {
            var thisView = new SermonCollectionView();
            expect(thisView.init).toBeDefined();
        });
        
        it("should have a popup", function () {
            var thisView = new SermonCollectionView();
            expect(thisView.popup).toEqual(jasmine.any(SermonPopupView));
        });
    });
});

describe("SermonPopupView", function () {
    beforeEach(function () {
        $('body').append("<div id='stage'></div>");
        var el = $('#stage');
        el.append("<div id='scrollIndicator'><div></div></div><div id='horizontalWrapper'><div></div></div>");
        el.append(sermonPopupTemplate);
    
        app.initialize();
        //app.onDeviceReady();
    });
    
    afterEach(function () {
        $('#stage').remove();
    });

    describe("initialize", function () {     
        it("should create a template", function () {
            var thisView = new SermonPopupView({collection: {}, displayName: "test"});
            expect(thisView.template).toBeTruthy();
        });
        
        it("should throw an exception if no collection is specified", function () {
            var errorThrown = false;
            try {
                var thisView = new SermonPopupView({displayName: "test"});
            } catch (error) {
                errorThrown = true;
            }
            expect(errorThrown).toBe(true);
        });
        
        it("should throw an exception if no name is defined", function () {
            var errorThrown = false;
            try {
                var thisView = new SermonPopupView({collection: {}});
            } catch (error) {
                errorThrown = true;
            }
            expect(errorThrown).toBe(true);
        });
        
        it("should add an route for the popup", function () {
            spyOn(app.router,'route');
            var thisView = new SermonPopupView({collection: {}, displayName: "test"});
            expect(app.router.route).toHaveBeenCalled();
        });
    });
    
    describe("removeElement", function () {
        it("should remove the element from the DOM", function () {
            var thisView = new SermonPopupView({collection: {get: function() {return {}}},displayName: "test"});
            thisView.render();
            thisView.removeElement();
            expect($(".sermonPopup").length).toBeFalsy();
        });
    });
});