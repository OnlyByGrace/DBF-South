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
    template: "download-item-template"
});

var DownloadCollectionView = CachingCollectionView.extend({
    displayName: 'Downloads',
    offline: true,
    
    init: function () {
        _.bindAll(this, 'newDownload');
        this.listenTo(app,'newDownload',this.newDownload);
    },
    
    newDownload: function (newModel) {
        this.collection.add(new DownloadModel(newModel));
    },
    
    itemAdded: function (newModel) {
		var newView = new DownloadModelView({model: newModel});
		this.$el.append(newView.render());
        app.trigger('downloadAdded', newModel.id);
	}
});