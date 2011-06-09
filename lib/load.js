/**
 * <p><b>MODULE: load</b></p>
 * 
 * <p>Loads all *.js files from a directory. Additionally all files are scanned
 * for require()-calls to create a dependency list for every file.</p>
 * 
 * <p>If the file ends on .class.js, the build module is called to build a
 * Constructor-function for this class.</p>
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
    build = require('./build'),
    modulesToPrepare,
    requirements,
    basePath;

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
 * @param {String} filePath
 * @returns {Undefined}
 */
function recursiveLoad(filePath) {
    var stats = fs.statSync(filePath),
        src,
        files,
        data,
        i,
        requireMatches,
        singleRequire,
        module;
    
    if(stats.isDirectory()) {
        files = fs.readdirSync( filePath);
        for(i=0; i<files.length; i++) {
            recursiveLoad(filePath + '/' + files[i]);
        }
    } else if(stats.isFile()) {
        if(/\.js$/.test(filePath) === false) {
            filePath = filePath + '.js';
        }
        console.log('loading file ' + filePath);
        data = fs.readFileSync(filePath, 'utf8');
        requireMatches = data.match(/= *require\(['"].*['"]\)/g);  // extracting all require statements
        if(requireMatches) {
            for(i=0; i<requireMatches.length; i++) {
                singleRequire = requireMatches[i];
                singleRequire = singleRequire
                    .replace(/^= *require\(['"]/, '') // removes leading require('
                    .replace(/['"]\);?$/, ''); // removes trailing ')
                singleRequire = require.resolve(singleRequire);
                if(singleRequire.match(basePath)) {
                    singleRequire = singleRequire.substr(basePath.length);  // removes the basePath so no 
                }
                requireMatches[i] = singleRequire;
            }
        } else {
            requireMatches = [];
        }
        requirements[filePath.substr(basePath.length)] = requireMatches;
        module = require(filePath);
        if(module.Prepare) {
            modulesToPrepare.push(module);
        }
        if(/\.class\.js$/.test(filePath)) {
            if(module.Class && !module.Constructor) {
                console.log('building class ' + filePath);
                try {
                    src = build(filePath);
                } catch(e) {
                    throw new Error('load error: an error occured while building class ' + filePath + '.\n' + e);
                }
                sandbox.exports = module;
                vm.runInNewContext(src, sandbox);
            } else if(!module.Constructor) {
                throw new Error('load error: cannot find "Class" or "Constructor" property of class module ' + filePath + '.');
            }
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
function prepare() {
    _(modulesToPrepare).each(function eachModule(module) {
        module.Prepare();
        if(module.InitConstructor) {
            module.InitConstructor();
        } 
    });    
}



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
function resolvePath(filePath) {
    var nodeModules = __dirname.substr(1).split('/'),   // substr(1) to remove the first slash
        currentPath,
        error,
        i;
    
    if(filePath.charAt(0) === '/') {    // IF TRUE: the path is absolute, so we dont have to do anything
        return filePath;
    }
    for(i=nodeModules.length-1; i>=0; i--) {
        currentPath = '/' + nodeModules.join('/');
        try {
            fs.statSync(currentPath + '/' + filePath); 
            // if the statement above throws no error we have found the right path
            return currentPath + '/' + filePath;
        } catch(e) {
            error = e;
            nodeModules.pop();  // this folder didnt work, so we remove the current and try again one step above
        }
    }

    throw error;
}



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
 * @param {String} filePath path to a file or folder
 * @returns {Object} requirements an object containing all requirements for the loaded files
 */
function load(filePath) {
    var fullFilePath = resolvePath(filePath);
    
    requirements = {};
    modulesToPrepare = [];
    basePath = fullFilePath.substr(0, fullFilePath.length - filePath.length);
    console.log(basePath);
    console.log('loading files from ' + filePath);
    recursiveLoad(fullFilePath);
    prepare();
    console.log('finished loading files from ' + filePath);
    
    return requirements;
}

module.exports = load;