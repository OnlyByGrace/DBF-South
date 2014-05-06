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
        fileName: '',
        data: null
    },
    
    sync: function () {
    }
});

var DownloadManagerCollection = Backbone.Collection.extend({
    model: DownloadManagerModel,
    paused: true,
    currentDownload: null,
    
    initialize: function () {
        _.bindAll(this,'itemAdded','start', 'removed','downloadError','downloadSuccess','downloadProgress');
        
        this.listenTo(this,'add',this.itemAdded);
        this.bind('remove',this.removed);
    },
    
    removed: function (model) {
        var downloadPromise = model.get("downloadPromise");
        if (downloadPromise) {
            downloadPromise.cancel();
        }
    },
    
    itemAdded: function () {
        this.paused = false;
        this.start();
    },
    
    start: function () {
        if ((this.paused == false) && (this.currentDownload == null)) {
            console.log("starting queue");
            var thisItem = this.at(0);
            if (thisItem) {
                this.currentDownload = thisItem.id;
                //setTimeout(this.downloadProgress, 1000, 0);
                (function (context, thisItem) {
                    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                        fileSystem.root.getDirectory("sermons", { create: true }, function (targetDirectory) {
                            targetDirectory.getFile(thisItem.get("fileName"), { create: true }, function (targetFile) {
                                var downloader = new BackgroundTransfer.BackgroundDownloader();
                                //Create a new download operation.
                                //console.log(JSON.stringify(thisItem));
                                var download = downloader.createDownload(thisItem.get("data").get("url"), targetFile);
                                //Start the download and persist the promise to be able to cancel the download.
                                //console.log(JSON.stringify(download));
                                console.log("yes, we are downloading it now");
                                thisItem.get("data").set("progress", 0);
                                thisItem.set("downloadPromise", download.startAsync().then(context.downloadSuccess, context.downloadError, context.downloadProgress));
                            });
                        });
                    });
                })(this, thisItem);
            }
        }
    },
    
    pause: function () {
        this.paused = true;
    },
    
    downloadSuccess: function () {
        console.log("success!");
        this.get(this.currentDownload).get('data').set("downloaded", true);
        try {
            this.get(this.currentDownload).destroy();
        } catch (e) {
            console.log(e);
            throw e;
        }
        console.log("restarting...");
        this.currentDownload = null;
        this.start();
    },
    
    downloadError: function (err) {
        console.log(err);
        this.currentDownload = null;
        this.start();
    },
    
    downloadProgress: function (progress) {
        console.log("progress: " + progress);
        //console.log(JSON.stringify(this.collection.get(this.currentDownload)));
        this.get(this.currentDownload).get('data').set("progress", progress);
    }
});

var DownloadManager = new DownloadManagerCollection();

var DownloadModelView = TemplateModelView.extend({
    className: 'download-item', 
    template: "download-item-template",
    
    events: {
		'tap .deleteDownloadLink' : 'deleteDownload',
        'tap .cancelDownloadLink' : 'deleteDownload',
        'tap' : ''
	},
    
    init: function () {
        _.bindAll(this,'deleteDownload', 'removeFile');
        
        if (this.model) {
			this.listenTo(this.model,'destroy',this.removeFile);
            this.listenTo(this.model,'change:progress',this.onProgress);
            this.listenTo(this.model,'change:downloaded',this.onProgress);
		}
    },
    
    deleteDownload: function () {
        if (confirm("Are you sure you want to delete this download?")) {
            this.model.destroy();
        }
    },
    
    removeFile: function (model) {
    
        var url = this.model.get("url");
        url = url.substring(url.lastIndexOf('/') + 1);
        util.deleteFile(url);
        
        if (DownloadManager.findWhere({ id: model.id })) {
            console.log(model.id + " is being downloaded, remove.");
            DownloadManager.remove(DownloadManager.get(model.id));
        }
        
        app.trigger('downloadRemoved',model.id);
    },
    
    onProgress: function () {
        this.render();
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
        if (newModel.get("downloaded") == false) {
            var url = newModel.get("url");
            url = url.substring(url.lastIndexOf('/') + 1);
            DownloadManager.add(new DownloadManagerModel({ id: newModel.id, fileName: url, url: newModel.get("url"), data: newModel})); //Start downloading the file from the server
        }
    
		var newView = new DownloadModelView({model: newModel});
		this.$el.append(newView.render());
        app.trigger('downloadAdded', newModel.id);
	}
});