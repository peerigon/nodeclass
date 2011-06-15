/**
 * <p><b>MODULE: load</b></p>
 * 
 * <p>Loads all *.class.js files from a directory and builds a Constructor-
 * function for this class.</p>
 * 
 * @requires third-party: underscore http://documentcloud.github.com/underscore/
 * @requires module: build
 * 
 * @version 0.1.0
 */



// Module variables
var vm = require('vm'),
    fs = require('fs'),
    _ = require('underscore'),
    build = require('./build');

var fileWalker = new FileWalker();
    
// Sandbox to execute the returned code from the build module
var sandbox = {
    "exports": null,
    "console": console
};

/**
 * <p>Tries to load a given path.</p>
 * 
 * <p>If the path is a folder, than the function is called again for all
 * items in this folder.</p>
 * 
 * <p>If the path is a file, the contents of the file are loaded and scanned
 * for require()-occurences. Furthermore the module is added to the
 * modulesToPrepare-object. That way the .Prepare()-function can be called afterwards.</p>
 * 
 * @private
 * @returns {Undefined}
 */
function buildClasses(classPath, loadedClasses) {
    var i,
        path,
        module,
        src,
        modulesToInitialize = [];
    
    for(i in loadedClasses) {
        path = loadedClasses[i];
        module = require(path);
        if(!module.Class) {
            throw new Error('node.class error: cannot find "Class" or "Constructor" property of class module ' + path + '.');
        }
        if(!module.Constructor) {
            console.log('building class ' + path);
            try {
                src = build(path);
            } catch(e) {
                throw new Error('node.class error: an error occured while building class ' + path + '.\n' + e);
            }
            sandbox.exports = module;
            vm.runInNewContext(src, sandbox);
            if(module.InitConstructor || module.Prepare) {
                modulesToInitialize.push(module);
            }
        }
    }
    i=0;
    for(i in modulesToInitialize) {
        if(module.InitConstructor) {
            module.InitConstructor();
        }
        if(module.Prepare) {
            module.Prepare();
        }
    }
}



/**
 * <p>Calls .Prepare() on every module of modulesToPrepare.</p>
 * 
 * <p>When the module is a classmodule, it also calls the InitConstructor
 * function to initialize the Constructor-function.</p>
 * 
 * @private
 * @returns {Undefined}
 */
/*function prepare() {
    _(modulesToPrepare).each(function eachModule(module) {
        module.Prepare();
        if(module.InitConstructor) {
            module.InitConstructor();
        } 
    });    
}*/



/**
 * <p>Tries to resolve an absolute path for the given path using the node's
 * require.resolve algorithm. require.resolve itself can't be used because
 * the filePath can be a folder's path. require.resolve would throw an error
 * in this case.</p>
 * 
 * @private
 * @param {String} filePath
 * @returns {Undefined}
 */
/*function resolvePath(filePath) {
    var lookUpDirs = __dirname.substr(1).split('/'),   // substr(1) to remove the first slash
        currentPath,
        error,
        i;
    
    if(filePath.charAt(0) === '/') {    // IF TRUE: the path is absolute, so we dont have to do anything
        return filePath;
    }
    for(i=lookUpDirs.length-1; i>=0; i--) {
        currentPath = '/' + lookUpDirs.join('/');
        try {
            fs.statSync(currentPath + '/' + filePath); 
            // if the statement above throws no error we have found the right path
            return currentPath + '/' + filePath;
        } catch(e) {
            error = e;
            lookUpDirs.pop();  // this folder didnt work, so we remove the current and try again one step above
        }
    }

    throw error;
}
*/


/**
 * <p>Loads all classes within a given class path. You may load a single file or
 * whole folders. The path to it can be relative or absolute. In case of it's
 * relative, the module steps backwards from __dirname and appends the given
 * file path to every directory.</p>
 * 
 * <p>Returns an object that contains all requirements of the loaded files. The 
 * requirements are resolved by scanning the code for require statements.
 * The class paths are used as keys. The values are arrays with paths to the
 * required files. If there are no requirements, the value is an empty array.</p>
 * 
 * <p>Note: All files loaded are interpreted as utf-8</p>
 * 
 * @param {String} classPath path to a file or folder
 * @returns {Object} requirements an object containing all requirements for the loaded files
 */
function load(classPath) {
    if(/node_modules\/?$/.test(classPath) === false) {
        throw new Error('node.class error: Can only load from class paths ending on "node_modules"');
    }
    
    console.log('loading files from ' + classPath);
    
    fileWalker.walkSync(classPath);
    
    console.log('finished loading files from ' + classPath);
}



fileWalker.fileFilter = function filterClassFiles(fileName) {
    return /\.class\.js$/gi.test(fileName);
};

fileWalker.on('end', buildClasses);

module.exports = load;