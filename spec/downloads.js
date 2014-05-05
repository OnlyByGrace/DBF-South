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
        });
        
        describe("newDownload", function () {
            it("should add a new item to the collection", function () {
                $(document.body).append("<div id='stage'><div id='download-item-template'></div></div>");
                var thisView = new DownloadCollectionView({collection: DownloadCollection});
                //spyOn(thisView.newDownload);
                thisView.newDownload(new DownloadModel({'url':'test'}));
                expect(thisView.collection.length).toBe(1);
                $('#stage').remove();
            });
        });
    })
});