var TemplateModelView = Backbone.View.extend({
	events: {
		'tap': 'onTap'
	},
	initialize: function (opts) {
		_.bindAll(this,'render','unrender','onTap');
		
		if (((!opts) || (!opts.template)) && (!this.template)) {
			throw "No template specified";
		}
		
        var templateId = null;
		if (opts) {
            templateId = opts.template;
        }
        
		if (!templateId) {
			templateId = this.template;
		}
		
		var source = $('#'+templateId).html();
        this.template = Handlebars.compile(source);
		
		if (this.model) {
			this.listenTo(this.model,'destroy',this.unrender);
		}
	},
	
	render: function () {
		this.$el.html(this.template(this.model.attributes));
		return this.el;
	},
	
	unrender: function () {
		this.remove();
	},
	
	onTap: function () {
	}
});

var TemplatePopupView = Backbone.View.extend({
    className: "templatePopup",
    events: {
        'click' : 'onClick',
        '.button click': 'close'
    },
    initialize: function (opts) {
        _.bindAll(this,'render','unrender','removeElement','onClick','close');
    
        if (opts) {
            if (opts.collection) {
                this.collection = opts.collection;
            }
            
            if (opts.template) {
                this.template = opts.template;
            }
            
            if (opts.route) {
                this.route = opts.route;
            }
        }
    
        if (!this.collection) {
            throw "No collection specified";
        }
        
        if (!this.template) {
            throw "No template specified";
        }
        
        if (!this.route) {
            throw "No route specified";
        }
        
        var source = $(this.template).html();
        this.template = Handlebars.compile(source);
        
        app.router.route(this.route,this.id);
        this.listenTo(app.router,'route',this.render);
        
        this.currentId = 0;
        
        this.init();
    },
    
    init: function () {
    },
    
    render: function (route, params) {
        if (route != this.id) {
            return this.unrender();
        }

        if (!this.collection.get(params[0])) {
            return;
        }
        
        this.currentId = params[0];
    
        $(this.el).html(this.template(this.collection.get(this.currentId).attributes));
        $('body').append(this.el);
        $(this.el).transition({ top: "45px"} /*{ complete: this.shown }*/);
    },
    
    unrender: function (route, params) {
        //console.log(route);
        if ($.contains(document.body,this.el)) {
            $(this.el).transition({ top: "100%", duration: 200, complete: this.removeElement});
        }
    },
    
    removeElement: function () {
        this.$el.detach();
    },
    
    close: function () {
        window.history.back();
    },
    
    /* Should be overwritten */
    onClick: function () {
    }
});