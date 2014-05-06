var util = {
    getFile: function (fileName, createIfNot) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getDirectory("sermons", { create: true }, function (targetDirectory) {
                targetDirectory.getFile(fileName, { create: createIfNot }, function (targetFile) {
                    return targetFile;
                }, function () {
                    return null;
                });
            });
        }, function () {
            throw "Could not access file system."
        });
    },
    
    deleteFile: function (path) {
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
            fileSystem.root.getDirectory("sermons", {}, function (targetDirectory) {
                targetDirectory.getFile(path, {}, function (targetFile) {
                    targetFile.remove(function () {
                        return true;
                    }, function () {
                        console.log("error");
                        return false;
                    });
                });
            });
        }, function () {
            throw "Could not access file system."
        });
    }
};