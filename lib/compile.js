/**
 * <p><b>MODULE: compile</b></p>
 * 
 * <p>Loads all *.class.js files from a directory, builds a Constructor-
 * function for this class and saves the result into compiled files.</p>
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
    Finder = require('fshelpers').Finder,
    pathUtil = require('path'),
    writeSync = require('fshelpers').writeSync,
    build = require('./build');

var srcFinder = new Finder(),
    currentSrcPath,
    currentCompilePath,
    options,
    classes;


/**
 * <p>Tries to load a given path.</p>
 * 
 * <p>If the path is a folder the function is called again for all
 * items in this folder.</p>
 * 
 * <p>If the path is a file, the contents of the file are loaded and scanned
 * for require()-occurences. Furthermore the module is added to the
 * modulesToPrepare-object. That way the .Prepare()-function can be called afterwards.</p>
 * 
 * @private
 * @return {Undefined}
 */
function buildClasses(currentSrcPath, classesToLoad) {
    var path,
        module,
        loaded = {},
        src;

    function sandboxRequire(requirePath) {
        var module,
            resolvedPath;
        
        if (requirePath.charAt(0) === '.') {
            resolvedPath = pathUtil.resolve(pathUtil.dirname(path), requirePath);
        } else {
            resolvedPath = currentSrcPath + '/' + requirePath;
        }

        try {
            resolvedPath = require.resolve(resolvedPath);
            module = load(resolvedPath);
        } catch(err) {
            module = require(requirePath);   // adds support for native modules
        }
        
        return module;
    }
    
    function load(path) {
        var src,
            sandbox = {     // Sandbox to execute the returned code from the build module
                "console": console,
                "require": sandboxRequire
            };
        
        if(!loaded[path]) {
            src = classesToLoad[path];
            vm.runInNewContext(src, sandbox);
            loaded[path] = sandbox;
        }
        
        return loaded[path];
    }
    
    for(path in classesToLoad) {
        src = classesToLoad[path];
        module = load(path);
        if(!module.Class && !module.Constructor) {
            throw new Error('Cannot find "Class"- or "Constructor"-property of class module ' + path + '.');
        }
        if(!module.Constructor) {
            console.log('compiling ' + path);
            try {
                src += '\n\n\n' + build(module, path);
            } catch(e) {
                throw new Error('An error occured while building class ' + path + '.\n' + e);
            }
        }
        path = path.replace(/.*?node_modules\//gi, '');
        classes[path] = src;
    }
}



function initClasses() {
    var path,
        module;
    
    for(path in classes) {
        module = require(currentCompilePath + '/' + path);
        if(module.InitConstructor) {
            module.InitConstructor();
        }
    }
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
 * @param {String} currentSrcPath path to a file or folder
 * @returns {Object} requirements an object containing all requirements for the loaded files
 */
function compile(srcPath, compilePath, compileOptions) {
    if(/node_modules\/?$/.test(srcPath) === false) {
        throw new Error('Only source paths ending on "node_modules" are allowed.');
    }
    if(/node_modules\/?$/.test(srcPath) === false) {
        throw new Error('Only compile paths ending on "node_modules" are allowed.');
    }
    if(!compileOptions) {
        compileOptions = {
            encoding: 'utf8'
        };
    }
    srcPath = srcPath.replace(/\/$/, '');   // deletes the last slash if present
    compilePath = compilePath.replace(/\/$/, '');   // deletes the last slash if present
    console.log('compiling files from ' + srcPath);
    options = compileOptions;
    currentSrcPath = srcPath;
    currentCompilePath = compilePath;
    classes = {};
    srcFinder.walkSync(srcPath, Finder.RECURSIVE, compileOptions.encoding);
    writeSync(compilePath, classes, compileOptions.encoding);
    initClasses();
    console.log('finished compiling files from ' + srcPath);
}


srcFinder.on('end', buildClasses);
srcFinder.fileFilter = function filterClassFiles(fileName) {
    return /\.class\.js$/gi.test(fileName);
};


module.exports = compile;