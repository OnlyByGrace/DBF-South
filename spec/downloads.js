describe("Downloads Section", function () {
    describe("DownloadModel", function () {
        it("should have defaults defined", function () {
            var thisModel = new DownloadModel();
            expect(thisModel.id).toBeDefined();
            expect(thisModel.get("title")).toBeDefined();
            expect(thisModel.get("description")).toBeDefined();
            expect(thisModel.get("length")).toBeDefined();
            expect(thisModel.get("speaker")).toBeDefined();
            expect(thisModel.get("url")).toBeDefined();
            expect(thisModel.get("downloaded")).toBeDefined();
            expect(thisModel.get("progress")).toBeDefined();
            expect(thisModel.get("state")).toBeDefined();
        });
    });
    
    describe("DownloadModelView", function () {
        it("should inherit from TemplateModelView", function () {
            $(document.body).append("<div id='stage'><div id='download-item-template'></div></div>");
            
            var thisView = new DownloadModelView();
            expect(thisView).toEqual(jasmine.any(TemplateModelView));
            
            $('#stage').remove();
        });
        
        describe("removed", function () {
            beforeEach(function () {
                $(document.body).append("<div id='stage'><div id='download-item-template'></div></div>");
                
                window.LocalFileSystem = {};
                spyOn(util,'getFile');
                spyOn(util,'deleteFile');
            }),
            
            afterEach(function () {
                delete window.LocalFileSystem;
                $('#stage').remove();
            }),
            
            it("should delete a file when a model is destroyed if downloaded", function () {
                var thisModel = new DownloadModel({'url': "http://soeijfe/soeijf/12345"});
                var thisView = new DownloadModelView({model: thisModel});
                console.log(JSON.stringify(thisModel));
                thisModel.destroy();
                
                expect(util.deleteFile).toHaveBeenCalledWith("12345");
            });
            
            it("should fire downloadRemoved event", function () {
                $(document.body).append("<div id='stage'><div id='download-item-template'></div></div>");
                app.trigger = jasmine.createSpy('trigger');
                var thisModel = new DownloadModel({'url':'test'});
                var thisView = new DownloadModelView({model: thisModel});
                thisModel.destroy();
                expect(app.trigger).toHaveBeenCalledWith("downloadRemoved", thisModel.id);
                $('#stage').remove();
            });
        });
    });
    
    describe("DownloadCollection", function () {
        it("should inherit from CachingCollection", function () {
            var thisCollection = new DownloadCollection();
            expect(thisCollection).toEqual(jasmine.any(CachingCollection));
        });
    });

    describe("DownloadCollectionView", function () {
        it("should inherit from CachingCollectionView", function() {
            var thisView = new DownloadCollectionView({collection: DownloadCollection});
            expect(thisView).toEqual(jasmine.any(CachingCollectionView));
        });
        
        it("should be an offline collection", function () {
            var thisView = new DownloadCollectionView({collection: DownloadCollection});
            expect(thisView.offline).toBe(true);
        });
        
        describe("itemAdded", function(){
            it("should add an element to this el", function () {
                $(document.body).append("<div id='stage'><div id='download-item-template'></div></div>");
                var thisView = new DownloadCollectionView({collection: DownloadCollection});
                var thisModel = new DownloadModel({'url':'test'});
                thisView.itemAdded(thisModel);
                expect(thisView.el.children.length).toBe(2);
                $('#stage').remove();
            });
            
            it("should fire downloadAdded event", function () {
                $(document.body).append("<div id='stage'><div id='download-item-template'></div></div>");
                app.trigger = jasmine.createSpy('trigger');
                var thisView = new DownloadCollectionView({collection: DownloadCollection});
                var thisModel = new DownloadModel({'url':'test'});
                thisView.itemAdded(thisModel);
                expect(app.trigger).toHaveBeenCalledWith("downloadAdded", thisModel.id);
                $('#stage').remove();
            });
            
            //it should add to download manager if downloaded == false
        });
        
        describe("newDownload", function () {
            it("should add a new item to the collection", function () {
                $(document.body).append("<div id='stage'><div id='download-item-template'></div></div>");
                var thisView = new DownloadCollectionView({collection: DownloadCollection});
                thisView.newDownload(new DownloadModel({'url':'test'}));
                expect(thisView.collection.length).toBe(1);
                $('#stage').remove();
            });
        });
    })
});

describe("DownloadManager", function () {

    describe("DownloadManagerModel", function () {
    });
    
    describe("CurrenDownloadCollection", function () {
    });
    //it should hold a list of queued download items
    //it should start the queue when a new item is added
    //it should call a progress function when the download progresses
    //it should cancel the download and delete the file if cancelled
    //it should remove the item from the queue when finished
    //it should publish a download complete event
    //it should start downloading the next item
});