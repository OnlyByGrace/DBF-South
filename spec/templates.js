describe("Template Model View", function () {
	beforeEach(function () {
		$('body').append("<div id='test-template'><h5>{{title}}</h5></div>");
	});
	
	afterEach(function () {
		$('#test-template').remove();
	});

	describe("initialize", function () {
		it("should create a template from the template parameter", function () {
			var thisView = new TemplateModelView({template: 'test-template'});
			expect(thisView.template).toBeTruthy();
		});
		
		it("should throw an error if no template is defined", function () {
			var error = false;
			
			try {
				var thisView = new TemplateModelView();
			} catch (err) {
				if (err == "No template specified") {
					error = true;
				}
			}
			
			expect(error).toBe(true);
		});
	});
	
	describe("render", function () {
		it("should return the element", function () {
			var thisView = new TemplateModelView({model:new Backbone.Model({title: "test"}),template: 'test-template'});
			var response = thisView.render();
			expect(response.innerHTML).toBe("<h5>test</h5>");
		});
	});
	
	describe("unrender", function () {
		it("should remove the dom element when the model is destroyed", function () {
			var thisModel = new Backbone.Model({title: "test"});
			var thisView = new TemplateModelView({model: thisModel, template: 'test-template',className:'news-item'});
			$('#test-template').append(thisView.render());
			expect($('#test-template').children().length).toBe(2);
			thisModel.destroy();
			expect($('#test-template').children().length).toBe(1);
		});
	});
});

describe("Template Popup View", function () {
    beforeEach(function () {
        $(document.body).append("<div id='stage'><div id='testTemplate'>Test</div></div>");
    });
    
    afterEach(function () {
        $('#stage').remove();
    });
    
    describe("initialize", function () {
        it("should throw an error if no collection specified", function () {
            var caught = false;
            try {
                var thisView = new TemplatePopupView({template: 'test'});
            } catch (e) {
                caught = true;
            }
            expect(caught).toBe(true);
        });
        
        it("should throw an error if no template specified", function () {
            var caught = false;
            try {
                var thisView = new TemplatePopupView({collection: {}});
            } catch (e) {
                caught = true;
            }
            expect(caught).toBe(true);
        });
        
        it("should throw an error if no route specified", function () {
            var caught = false;
            try {
                var thisView = new TemplatePopupView({collection: {}, template: {}});
            } catch (e) {
                caught = true;
            }
            expect(caught).toBe(true);
        });
        
        it("should setup a route with the router", function () {
            spyOn(app.router, 'route');
            var thisView = new TemplatePopupView({id: "sermonPopup", collection: {}, template: "#testTemplate", route: "sermons/:id"});
            expect(app.router.route).toHaveBeenCalledWith("sermons/:id", "sermonPopup");
        });
    });
});