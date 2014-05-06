var DownloadModel = Backbone.Model.extend({
    idAttribute: 'url',
    defaults: {
        title: '',
        description: '',
        length: '',
        speaker: '',
        url: '',
        downloaded: '',
        progress: '',
        state: ''
    },
    
    sync: function () {
    }
});

var DownloadCollection = CachingCollection.extend({
    model: DownloadModel
});


var DownloadManagerModel = Backbone.Model.extend({
    defaults: {
        downloadPromise: null,
        data: null
    }
});

var DownloadModelView = TemplateModelView.extend({
    className: 'download-item', 
    template: "download-item-template",
    
    events: {
		'click .deleteDownloadLink' : 'deleteDownload',
        'click .cancelDownloadLink' : 'deleteDownload'
	},
    
    init: function () {
        _.bindAll(this,'deleteDownload', 'removeFile');
        if (this.model) {
			this.listenTo(this.model,'destroy',this.removeFile);
		}
    },
    
    deleteDownload: function () {
        this.model.destroy();
    },
    
    removeFile: function (model) {
        var url = this.model.get("url");
        url = url.substring(url.lastIndexOf('/') + 1);
        util.deleteFile(url);
        app.trigger('downloadRemoved',model.id);
    }
});

var DownloadCollectionView = CachingCollectionView.extend({
    displayName: 'Downloads',
    offline: true,
    icon: "images/glyphicons_200_download.png",
    collection: DownloadCollection,
    
    init: function () {
        _.bindAll(this, 'newDownload');
        this.listenTo(app,'newDownload',this.newDownload);
    },
    
    newDownload: function (newModel) {
        this.collection.add(new DownloadModel(newModel.attributes));
    },
    
    itemAdded: function (newModel) {
		var newView = new DownloadModelView({model: newModel});
		this.$el.append(newView.render());
        app.trigger('downloadAdded', newModel.id);
	}
});