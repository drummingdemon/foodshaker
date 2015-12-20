function checkCheckedItems() {
    console.log('Checking checked items');
    window.checkedIds = $(":checkbox:checked").map(function() {
        return this.id;
    }).get();
    //console.log(window.checkedIds);
}

// prototypes for data storage
Storage.prototype.setArray = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}

// prototypes for data retrieval
Storage.prototype.getArray = function(key) {
    return JSON.parse(this.getItem(key))
}

function setListChecked() {
    console.log('Setting checked items checked...');
    $("#1").prop("checked", true);
}

function onFileSystemSuccess(fileSystem) {
    console.log(fileSystem.name);
    console.log(fileSystem.root.name);
    fileSystem.root.getFile(localDataName, {create: true, exclusive: false}, gotFileEntry, failFile);
}
                
function lookupBackupFileLocation(fileSystem) {
    console.log('Locating '+localDataName);
    fileSystem.root.getFile(localDataName, {create: true, exclusive: false}, setLocalLocation, failFile);                        
}

function gotFileEntry(fileEntry) {
    console.log(fileEntry);
    localLocation = fileEntry.nativeURL;
    fileEntry.createWriter(gotFileWriter, fail);
}
                    
                    function setLocalLocation(fileEntry) {
                        console.log(fileEntry);
                        window.localLocation = fileEntry.nativeURL;
                        console.log('Global: '+window.localLocation);
                    }

                    function gotFileWriter(writer) {
                        writer.onwrite = function(evt) {
                            console.log('Writing to file: '+writer.textContent);
                        };
                        writer.write(localData);
                    }

                    function fail(evt) {
                        console.log('ERROR:' + evt.target.error.code);
                    }

                    function failFile(error) {
                        console.log('ERROR: ' + error.code);
                    }
                    
                    // retrieves root file system entry
                    var getFileSystemRoot = (function() {
                        // private
                        var root;

                        // one-time retrieval of the root file system entry
                        var init = function() {
                            window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
                                function(fileSystem) {
                                    root = fileSystem.root;
                                }, 
                                onFileSystemError);
                        };
                        document.addEventListener("deviceready", init, true); 
                        // public function returns private root entry
                        return function() {
                            return root;
                        };
                    }()); // execute immediately                
                    
                    // file system error handler
                    function onFileSystemError(error) {
                        var msg = 'file system error: ' + error.code;
                        navigator.notification.alert(msg, null, 'File System Error');
                    }
                     
                    // logs file events
                    function onFileEvent(event) {
                        console.log('file event: ' + event.target.fileName + ' ' + event.type);
                    }

                                        // called when error reading file
                    function onFileError(event) {
                        console.log('file error: ' + event.target.error.code);
                    }
                    // called when file is written
                    function onFileWrite(event) {
                        onFileEvent(event);
                        console.log('FileWriter position=' + 
                            event.target.position + ", length=" + event.target.length);
                    }
                    
                    // writes a text file to the device
                    function writeFile(data) {
                        // root file system entry
                        var root = getFileSystemRoot(),

                            // writes a file
                            write_file = function(writer) {
                                //var lineCount = 1;

                                // set the callbacks
                                writer.onwritestart = onFileEvent;
                                writer.onprogress = onFileEvent;
                                writer.onwrite = onFileWrite;
                                writer.onabort = onFileEvent;
                                writer.onerror = onFileError;
                                writer.onwriteend = function(event) {
                                    onFileEvent(event);
                                }

                                // append
                                //writer.seek(writer.length);

                                // write to file
                                writer.write(data);
                            },

                            // creates a FileWriter object
                            create_writer = function(fileEntry) {
                                fileEntry.createWriter(write_file, onFileSystemError);
                            };

                        // create a file and write to it
                        root.getFile(window.localDataName, {create: true}, create_writer, onFileSystemError);
                    }
        
                    // remove file system entry
                    function removeFile() {
                        var root = getFileSystemRoot();
                        var remove_file = function(entry) {
                            entry.remove(function() {
                                navigator.notification.alert(entry.toURI(), null, 'Entry deleted');                    
                            }, onFileSystemError);
                        };

                        // retrieve a file and truncate it
                        root.getFile('bbgap.txt', {create: false}, remove_file, onFileSystemError);
                    } 