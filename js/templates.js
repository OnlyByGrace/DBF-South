var TemplateModelView = Backbone.View.extend({
	events: {
		'click': 'onTap'
	},
	initialize: function (opts) {
		_.bindAll(this,'render','unrender','onTap');
		
		if ((!opts) || (!opts.template)) {
			throw "No template specified";
		}
		
		var source = $(opts.template).html();
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