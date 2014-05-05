var NewsModel = Backbone.Model.extend({
	defaults: {
		"title": '',
		"content": '',
        "text": '',
		"date": ''
	},
	
	sync: function () {
	}
});

var NewsModelView = TemplateModelView.extend({
	className: "news-item",
	template: "entry-template",
    
    onTap: function () {
        app.router.navigate("reader/"+this.model.cid, {trigger: true});
	}
});

var NewsPopupView = TemplatePopupView.extend({
    template: "#news-popup-template",
    route: "reader/:id",
    id: "newsPopup"
});

var NewsCollection = CachingCollection.extend({
	model: NewsModel,
	name: "news",
	url: "http://dbfsouth.org/?option=com_content&view=category&id=35&format=feed",
	complete: function (data) {
		var self = this;
		$(data).find("item").each(function () { // or "item" or whatever suits your feed
			var el = $(this);
			var description = $('<div/>').html(el.find("description").text()).text();
			var thisDate = new Date(Date.parse(el.find("pubDate").text()));
			var elData = {
				title: el.find("title").text(),
				text: description,
                content: el.find("description").text(),
				//date: thisDate.toLocaleDateString(),
				id: el.find("guid").text()
			};
			self.set(elData, {remove: false});
		});
		this.lastUpdate = new Date().toLocaleTimeString();
	}
});

var NewsCollectionView = CachingCollectionView.extend({
	displayName: 'news',
	icon: "images/glyphicons_045_calendar.png",
	collection: NewsCollection,
    
    init: function () {
        this.popup = new NewsPopupView({collection: this.collection});
    },
	
	itemAdded: function (newModel) {
		var newView = new NewsModelView({model: newModel});
		this.$el.append(newView.render());
		this.refresh();
	}
});