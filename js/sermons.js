var SermonModel = Backbone.Model.extend({
    idAttribute: 'url',
	defaults: {
		'title':'',
        'description': '',
		'speaker':'',
		'date':'',
		'length':'',
		'downloaded':false,
        'progress': 0,
		'url':''
	}
});

var SermonModelView = TemplateModelView.extend({
	className: 'sermon-item',
	template: 'sermon-template',
	
	onTap: function () {
        app.router.navigate("sermons/"+this.model.cid, {trigger: true});
	}
});

var SermonPopupView = TemplatePopupView.extend({
    template: "#sermon-popup-template",
    route: "sermons/:id",
    id: "sermonPopup",
    
    events: {
        'click .sermonPlayButton': 'onPlay',
        'click .sermonDownloadButton': 'onDownload',
    },
    
    init: function() {
        _.bindAll(this, 'onDownload');
    },

    onPlay: function () {
        
    },
    
    onDownload: function () {
        app.trigger('newDownload',this.collection.get(this.currentId));
    }
})

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
                speaker: el.find("dc\\:creator").text(),
                url: el.find("enclosure").attr("url"),
                length: el.find("itunes\\:duration").text(),
                date: el.find("pubdate").text()
            };
            var newModel = new SermonModel(elData);
            console.log(JSON.stringify(newModel));
            self.set(newModel,{remove : false});
            console.log(JSON.stringify(self));
        });
        app.trigger("getDownloads");
    }
});

var SermonCollectionView = CachingCollectionView.extend({
	displayName: 'Sermons',
	icon: "images/glyphicons_076_headphones.png",
	collection: SermonCollection,
    
    init: function () {
        _.bindAll(this, 'downloadAdded');
        this.popup = new SermonPopupView({collection: this.collection, displayName: this.displayName});
    },
    
    downloadAdded: function (id) {
        var thisModel = this.collection.get(id);
        if (thisModel) {
            thisModel.set('downloaded', true);
        }
    },
    
    downloadProgress: function (id, progress) {
        var thisModel = this.collection.get(id);
        if (thisModel) {
            thisModel.set('progress', progress);
        }
    },
	
	itemAdded: function (newModel) {
		var newView = new SermonModelView({model: newModel});
		this.$el.append(newView.render());
	}
});