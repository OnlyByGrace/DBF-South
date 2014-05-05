var TemplateModelView = Backbone.View.extend({
	events: {
		'tap': 'onTap'
	},
	initialize: function (opts) {
		_.bindAll(this,'render','unrender','onTap');
		
		if (((!opts) || (!opts.template)) && (!this.template)) {
			throw "No template specified";
		}
		
		var templateId = opts.template;
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
    className: "sermonPopup",
    events: {
        'click' : 'onClick'
    },
    initialize: function (opts) {
        _.bindAll(this,'render');
    
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
        
        app.router.route("sermons/:id","sermonPopup");
        this.listenTo(app.router,'route',this.render);
    },
    
    render: function (route, params) {
        if (route != "sermonPopup") {
            return this.unrender();
        }

        if (!this.collection.get(params[0])) {
            return;
        }
    
        $(this.el).html(this.template(this.collection.get(params[0]).attributes));
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
        this.$el.remove();
    },
    
    /* Should be overwritten */
    onClick: function () {
    }
});