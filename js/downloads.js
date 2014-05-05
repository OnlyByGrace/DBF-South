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
    }
});

var DownloadCollection = CachingCollection.extend({
    model: DownloadModel
});

var DownloadModelView = TemplateModelView.extend({
    className: 'download-item', 
    template: "download-item-template"
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