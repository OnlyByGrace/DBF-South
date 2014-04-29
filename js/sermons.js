var SermonModel = Backbone.Model.extend({
	defaults: {
		'title':'',
		'speaker':'',
		'date':'',
		'length':'',
		'downloaded':'',
		'url':''
	}
});

var SermonModelView = TemplateModelView.extend({
	className: 'sermon-item',
	template: 'sermon-template',
	
	onTap: function () {
		
	}
});

var SermonCollection = CachingCollection.extend({
	model: SermonModel,
	name: "sermons",
	url: "http://dbfsouth.org/sermons.xml",
	complete: function (data) {
        var self = this;
        $(data).find("item").each(function (index) { // or "item" or whatever suits your feed
            var el = $(this);
            var elData = {
                title: el.find("title").text(),
                description: el.find("description").text(),
                id: el.find("guid").text(),
                author: el.find("dc\\:creator").text(),
                url: el.find("enclosure").attr("url")
            };
            self.set(new SermonModel(elData),{remove : false});
        });
        app.trigger("getDownloads");
    }
});

var SermonCollectionView = CachingCollectionView.extend({
	displayName: 'Sermons',
	icon: "images/glyphicons_076_headphones.png",
	collection: SermonCollection,
	
	itemAdded: function (newModel) {
		var newView = new SermonModelView({model: newModel});
		this.$el.append(newView.render());
		this.refresh();
	}
});