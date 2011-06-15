/**
 * <p><b>MODULE: build</b></p>
 * 
 * <p>Builds a constructor function from a class module. The result is
 * returned as a string containing JavaScript-code, so it can be evaled inside
 * of the class module.</p>
 * 
 * <p>The constructor function wrappes a Properties-object, being a copy
 * of the original Class-object. Functions from the Class-object are not copied
 * but binded with the Properties-object as this-reference, so every operation
 * in a function is done on the current Properties-object.</p>
 * 
 * <p>Additionally the constructor function provides access to all public
 * members by default. To expose protected members as well, every constructor
 * function reads the exports.Constructor.$-object and constructs the new object
 * as instructed by the given flags. For instance: If $.exposeProtected is true,
 * the constructor provides access to all protected members, so a child-class
 * can use them, too. These flags are used:
 * <ol>
 *    <li>implChildAbstracts: an array that contains references to all abstract
 *    functions that are implemented in a child class</li>
 *    <li>constructorIsRunning: indicates that this constructor is not finished
 *    yet. If this flag is true, an recursion error is thrown.</li>
 *    <li>exposeProtected: if true, the constructor function exposes all
 *    protected class members.</li>
 *    <li>exposeNothing: if true, the constructor does nothing. This flag is
 *    set by a child class so it can use the super-constructor as a prototype
 *    to make the "instanceof"-operator work. Without this flag, every
 *    constructor function would have properties inherited by the super class
 *    which does not make any sense.</li>
 * </ol>
 * </p>
 * 
 * <p>This module uses the memoize caching-functionality provided by
 * the underscore framework. You can disable this behaviour by passing
 * false as second argument.</p>
 * 
 * @requires third-party: underscore http://documentcloud.github.com/underscore/
 * @requires module: toSrc git://github.com/jhnns/toSrc.git
 * 
 * @version 0.1.0
 */



var _ = require('underscore'),    // underscore framework
    toSrc = require('toSrc'),   // turns every object or primitive in a string representation
    cacheBuild,     // the "memoized"-function
    currentFile;    // contains the current processed file



// All variables with the prefix _ followed by a capital letter are underscore-templates.
// These templates are used by the getSource-function to generate JavaScript-code.
var _PropertiesLeftHand = 'Properties.<%= key %>', // used by every Properties-assignment on the left hand
    _FunctionRightHand = 'exports.Class.<%= key %>.bind(Properties)', // used by function assignments on the right hand
    _ImplAbstractsLeftHand = 'implAbstracts.<%= key %>', // saves all functions that were abstract and are implemented in this class
    _WrapperLeftHand = 'this.<%= key %>', // assignment on the left hand for all properties that are exposed
    _WrapperSuperRightHand = 'Properties.Super.<%= key %>', // assignment on right hand for all properties, that are exposed and inherited from a super class
    _SetterFunction = 'function(value){Properties.<%= key %>=value;}', // setter-function that provides access to a public property, that is not a function
    _GetterFunction = 'function(){return Properties.<%= key %>;}', // getter-function that provides access to a public property, that is not a function
    _StaticsLeftHand = 'exports.Constructor.<%= key %>', // left hand assignment for static properties
    _StaticsRightHand = 'exports.Class.<%= key %>', // right hand assignment for static properties
    _Init = 'exports.Class.<%= initName %>.apply(Properties,arguments);', // executes the init-function. requires the init name since there are two possible names
    _AbstractInstanceError = // this error gets thrown if the class is abstract and the constructor is not called by a child class
        'if(!exposeProtected&&!exposeNothing){throw new Error("class error in <%= classFile %>:\\n'
        + 'you cant instantiate an abstract class. these methods are declared as abstract: <%= abstractMethodNames %>.");}'    
    _Code = // the Constructor-function template
        'var Module=this;'
        + 'exports.Constructor=function(){' // constructor definition begins here
            + 'var tmp,'
            + 'implChildAbstracts,'
            + 'implAbstracts,'
            + 'constructorIsRunning,'
            + 'exposeProtected,'
            + 'exposeNothing,'
            + 'Properties,'
            + 'key;'
            + 'if(exports.Constructor.$){'  // reads the flag-object. these flags are used to modify the constructor's behaviour.
                + 'tmp=exports.Constructor.$;'
                + 'implChildAbstracts=tmp.implChildAbstracts;' // an array that contains references to all abstract functions that are implemented in a child class
                + 'constructorIsRunning=tmp.constructorIsRunning;' // indicates that this constructor is not finished yet. if this flag is true, an recursion error is thrown
                + 'exposeProtected=tmp.exposeProtected;' // if true, the constructor function exposes all protected class members
                + 'exposeNothing=tmp.exposeNothing;' // if true, the constructor does nothing
            + '}'
            + 'if(constructorIsRunning){' // if the constructor is currently running, it looks like it's trying to call itself. therefore a recursion error is thrown.
                + 'throw new Error("class error in <%= classFile %>:\\nconstructor recursion detected.");'
                + 'return;'
            + '}else{'
                + 'exports.Constructor.$={"constructorIsRunning":true};'
            + '}'
            + '<%= abstractInstanceError %>' // if the class is abstract and the constructor is called by a non-child an error must be thrown
            + 'if(!exposeNothing){'
                + 'if(!implChildAbstracts){'
                    + 'implChildAbstracts={};'
                + '}'
                + 'Properties={};'  // creates the Properties-object, where all the class's properties are stored
                + '<%= properties %>' // gets replaced by various assignments for all properties: private, protected, public
                + 'implAbstracts=implChildAbstracts;'
                + '<%= implAbstracts %>' // gets replaced by an object carrying all former abstract methods that are implemented by this class or a child class
                // the next section is used to assign all abstract methods that are implemented by a child class to the current Properties-object.
                // this is necessary so you can call this.abstractMethod in an abstract class.
                + 'for(key in implChildAbstracts){'
                    + 'if(implChildAbstracts.hasOwnProperty(key)){'
                        + 'Properties[key]=implChildAbstracts[key];'
                    + '}'
                + '}'
                + '<%= superConstructor %>' // gets replaced by the string superConstructor. but only in case of the class has a super class.
                + '<%= init %>' // the init function is called now, if it is available
                + '<%= superConstructorCall %>' // now the super constructor is called in case of it hasnt been called by the init function of this class.
                + '<%= wrapper %>' // gets replaced by various assignments for all public properties
                + 'if(exposeProtected){'
                    + '<%= exposeWrapper %>' // gets replaced by various assignments for all protected properties
                + '}'
            + '}'
            + 'delete exports.Constructor.$;' // deletes the flag-object
        + '};' // constructor definition ends here
        + '<%= statics %>' // various static assignments that can be accessed via Class.staticProperty
        + 'exports.Constructor.$construct=function(args){' // this special function is used to call the constructor with an argument-array since you cant use the .apply()-method with the new operator.
            + 'function Instance(){'
                + 'return exports.Constructor.apply(this,args);'
            + '}'
            + 'Instance.prototype=exports.Constructor.prototype;'
            + 'return new Instance();'
        + '};'
        + '<%= initConstructor %>'; // gets replaced by the string initConstructor in case of this class has a super class
    
    
    
// These variables contain static strings but are only used if the class has a super class
var initConstructor
        // a function that is called to initialize the constructor function. necessary to assign the
        // prototype if this class has a super class to make the instanceof-operator work.
        // To avoid the pollution by unused properties, the exposeNothing-flag of the super constructor is set to true.
        = 'exports.InitConstructor=function(){'
            + 'if(exports.Extends.InitConstructor){'
                + 'exports.Extends.InitConstructor();' // recursive call of the InitConstructor function of the super class.
            + '}'
            + 'exports.Extends.Constructor.$={'
                + '"exposeNothing":true'
                + '};'
            + 'exports.Constructor.prototype=new exports.Extends.Constructor();'
            + 'delete exports.InitConstructor;' // after execution, this function deletes itself since it is not used anymore
        + '};',
    superConstructor =
        // this function can be accessed within the init-function via this.Super();
        'Properties.Super=function(){'
            + 'exports.Extends.Constructor.$={'
                + '"exposeProtected":true,'
                + '"implChildAbstracts":implAbstracts'
            + '};'
            + 'Properties.Super=exports.Extends.Constructor.$construct(arguments);'
        + '};',
    superConstructorCall =
        // if the init-function hasnt called this.Super() it's called now
        'if(typeof Properties.Super==="function"){'
            + 'Properties.Super.apply(Module,arguments);'
        + '}';



// generating templates
_PropertiesLeftHand = _.template(_PropertiesLeftHand);
_FunctionRightHand = _.template(_FunctionRightHand);
_ImplAbstractsLeftHand = _.template(_ImplAbstractsLeftHand);
_WrapperLeftHand = _.template(_WrapperLeftHand);
_WrapperSuperRightHand = _.template(_WrapperSuperRightHand);
_SetterFunction = _.template(_SetterFunction);
_GetterFunction = _.template(_GetterFunction);
_StaticsLeftHand = _.template(_StaticsLeftHand);
_StaticsRightHand = _.template(_StaticsRightHand);
_Init = _.template(_Init);
_AbstractInstanceError = _.template(_AbstractInstanceError);
_Code = _.template(_Code);



/**
 * <p>Collects all properties of the classModule.Class-object and returns
 * them seperated by their visibility and functionality.</p>
 * 
 * <p>The returned object is structued like this:
 *   {<br />
 *       "Init": null,<br />
 *       "Private": {<br />
 *           "Function": {},<br />
 *           "Other": {}<br />
 *       },<br />
 *       "Protected": {<br />
 *           "Function": {},<br />
 *           "Other": {}<br />
 *       },<br />
 *       "Public": {<br />
 *           "Function": {},<br />
 *           "Other": {}<br />
 *       },<br />
 *       "Abstract": {},<br />
 *       "Static": {<br />
 *           "Function": {},<br />
 *           "Other": {}<br />
 *       }<br />
 *   };<br />
 * </p>
 * 
 * @private
 * @param {Object} classModule the class module where the properties should be collected
 * @param {Object} [result] optional result object. this object will be filled with all collected properties. must be structured as described above.
 * @returns {Object} result
 */
function collectProperties(classModule, result) {
    var key,
        prefix,
        Class = classModule.Class;
    
    if(!result) { // if the result object is not set, we create an empty one.
        result = {
            "Init": null,
            "Private": {
                "Function": {},
                "Other": {}
            },
            "Protected": {
                "Function": {},
                "Other": {}
            },
            "Public": {
                "Function": {},
                "Other": {}
            },
            "Abstract": {},
            "Static": {
                "Function": {},
                "Other": {}
            }
        };
    }
    
    _(Class).each(function eachProperty(value, key) {
        prefix = key.charAt(0);
        if(/^init(ialize)?$/.test(key)) {   // IF TRUE: init function
            if(result.Init) {   // IF TRUE: There is already an init function stored in the result object
                throw new Error('build error in ' + currentFile + ':\nfound two init methods: ' + key + ' and ' + result.Init + '.');
            } else if(typeof value !== 'function') {    // IF TRUE: the init property is not a function
                throw new Error('build error in ' + currentFile + ':\nthe init method "' + key + '" is not a function.');
            }
            result.Init = key;
        } else if(prefix === '?') { // IF TRUE: abstract property
            if(typeof value !== 'function') {
                throw new Error('build error in ' + currentFile + ':\nyou can only define abstract functions.\n'
                        + 'however, the abstract property "' + key + '" is typeof ' + typeof value + '.');
            }
            result.Abstract[key] = value;
        } else if(prefix === '$') { // IF TRUE: static property
            if(typeof value === 'function') {
                result.Static.Function[key] = value;
            } else {
                result.Static.Other[key] = value;
            }
        } else if(prefix !== '_') { // IF TRUE: public property
            if(typeof value === 'function') {
                result.Public.Function[key] = value;
            } else {
                result.Public.Other[key] = value;
            }
        } else {    // IF TRUE: private or protected property
            prefix = key.charAt(1); // now we're looking at the second character
            if(prefix === '_') {    // IF TRUE: private property
                if(typeof value === 'function') {
                    result.Private.Function[key] = value;
                } else {
                    result.Private.Other[key] = value;
                }
            } else {    // IF TRUE: protected property
                if(typeof value === 'function') {
                    result.Protected.Function[key] = value;
                } else {
                    result.Protected.Other[key] = value;
                }
            }
        }
    });

    return result;
}



/**
 * <p>Collects all super properties into one result. Works recursive, so if
 * the current class module provides an Extends-property, all properties of this
 * super class are collected first. Thus super properties are overridden by
 * properties of the current module.</p>
 * 
 * @private
 * @param {Object} module class module
 * @returns {Object} result
 */
function collectSuperProperties(module) {
    var result;
    
    if(module.Extends) {    // IF TRUE: this class has a super class. so we're collecting these properties first.
        result = collectSuperProperties(module.Extends);
        result = collectProperties(module, result);
    } else {
        result = collectProperties(module);
    }
    delete result.Init; // deleting the init-function to prevent the collectProperties-function from throwing an error
    
    return result;
}



/**
 * <p>Compares the properties of the current class with all collected properties
 * inherited by all super classes and saves all properties, that have the the same
 * name. These properties will be ignored when all super properties are exposed since
 * they are overriden by the current class.</p>
 * 
 * @param {Object} This all collected properties from the current class
 * @param {Object} Super all collected properties from the super classes
 * @returns {Object} overridden all properties, that have been overridden by the current class
 */
function collectOverriddenProperties(This, Super) {
    var overridden = {};
    
    _(This.Public.Function).each(function eachPublicFunction(value, key) {
        if(Super.Public.Function[key]) {
            overridden[key] = true;
        }
    });
    _(This.Public.Other).each(function eachPublicOther(value, key) {
        if(Super.Public.Other[key]) {
            overridden[key] = true;
        }
    });
    _(This.Protected.Function).each(function eachProtectedFunction(value, key) {
        if(Super.Protected.Function[key]) {
            overridden[key] = true;
        }
    });
    _(This.Protected.Other).each(function eachProtectedOther(value, key) {
        if(Super.Protected.Other[key]) {
            overridden[key] = true;
        }
    });

    return overridden;
}



/**
 * <p>Capitalizes the first letter. Used for camelCase-names for all setters and getters.</p>
 * 
 * @private
 * @param {String} string
 * @returns {String} string
 */
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}



/**
 * <p>Modifies the key-string, so it looks like an ordinary setter.</p>
 * <p>_someProperty becomes setSomeProperty</p>
 * 
 * @private
 * @param {String} key
 * @returns {String} key
 */
function setterKeyModificator(key) {
    return 'set' + capitalize(trimPrefix(key));
}



/**
 * <p>Modifies the key-string, so it looks like an ordinary getter.</p>
 * <p>_someProperty becomes getSomeProperty</p>
 * 
 * @private
 * @param {String} key
 * @returns {String} key
 */
function getterKeyModificator(key) {
    return 'get' + capitalize(trimPrefix(key));
}



/**
 * <p>Trims all prefixes like _ __ ? $</p>
 * 
 * @private
 * @param {String} key
 * @returns {String} key
 */
function trimPrefix(key) {
    return key.replace(/^[_\?\$]_?/, '');
}



/**
 * <p>Returns a string that contains some JavaScript-assignments.</p>
 * 
 * <p>All properties of the given collection will be transformed to an assignment
 * using the given templates. Additionally you can pass a function that modifies
 * the key that are used in the assignment.</p>
 * 
 * <p>All keys contained in the blacklist-object are ignored.</p>
 * 
 * <p>Example:<br />
 * <br />
 * collection = {"name": "John Doe", "age": 27 }<br />
 * blacklist = {"age": null}<br />
 * leftHandTemplate = "this.<%= varName %>"<br />
 * rightHandTemplate = "<%= varValue %>;"<br />
 * leftHandKeyModificator = function(key) {return key.charAt(0);}<br />
 * rightHandKeyModificator = function(key) {return key.charAt(0);}<br />
 * <br />
 * will result in: <br/>
 * "this.n=J;"
 * </p>
 * 
 * @private
 * @param {String} collection collection of key-value-pairs
 * @param {Function} leftHandTemplate underscore template to create the left hand side
 * @param {Function} [rightHandTemplate] optional underscore template to create the right hand side. If it's null, the value will be turned into source code
 * @param {Object} [blacklist={}] optional object with all keys that will be ignored
 * @param {Function} [leftHandKeyModificator] optional function to modify the key on the left side
 * @param {Function} [rightHandKeyModificator] optional function to modify the key on the right side
 * @returns {String} source code
 */
function getAssignment(
        collection,
        leftHandTemplate,
        rightHandTemplate,
        blacklist,
        leftHandKeyModificator,
        rightHandKeyModificator
    ) {
        
    var src = '';
    
    if(!blacklist) {
        blacklist = {};
    }
    if(!leftHandKeyModificator) {
        leftHandKeyModificator = _.identity;
    }
    if(!rightHandKeyModificator) {
        rightHandKeyModificator = _.identity;
    }
    _(collection).each(function eachProperty(value, key) {
        if(blacklist[key]) {
            return;
        }
        src += leftHandTemplate(
                {"key": leftHandKeyModificator(key)}
            )
            + '=';
        if(rightHandTemplate) {
            src += rightHandTemplate(
                {"key": rightHandKeyModificator(key)}
            );
        } else {
            src += toSrc(value);
        }
        src += ';';
    });
    
    return src;
}



/**
 * <p>Returns the source code for a Getter-function</p>
 * 
 * @private
 * @param {String} propertyName
 * @returns {String} source
 */
function getGetter(propertyName) {
    return 'function(){return Properties.' + propertyName + ';}';
}



/**
 * <p>Returns the source code for a Setter-function</p>
 * 
 * @private
 * @param {String} propertyName
 * @returns {String} source
 */
function getSetter(propertyName) {
    return 'function(value){Properties.' + propertyName + '=value;}';
}



/**
 * <p>Returns the source code for a class module</p>
 * 
 * @private
 * @param {String} This the result object after you've called collectProperties()
 * @param {String} [Super] optional an object containing all super properties, created via collectSuperProperties()
 * @returns {String} key
 */
function getSource(This, Super) {
    var properties = '',
        implAbstracts = '',
        wrapper = '',
        exposeWrapper = '',
        statics = '';
    
    // Creating the source code of the Properties-object.
    // The Properties-object contains copies from all properties of the original
    // Class-object. Additionally all functions are binded to this object.
    // Thus it is an independent instance and all changes occur only on this
    // object.
    properties += getAssignment(
            This.Private.Function,
            _PropertiesLeftHand,
            _FunctionRightHand
        )
        + getAssignment(
            This.Private.Other,
            _PropertiesLeftHand
        )
        + getAssignment(
            This.Protected.Function,
            _PropertiesLeftHand,
            _FunctionRightHand
        )
        + getAssignment(
            This.Protected.Other,
            _PropertiesLeftHand
        )
        + getAssignment(
            This.Public.Function,
            _PropertiesLeftHand,
            _FunctionRightHand
        )
        + getAssignment(
            This.Public.Other,
            _PropertiesLeftHand
        );
    
    // All abstract functions that are implemented by a child class are
    // now added to the Properties-object so we can access them in this class
    if(This.ImplementedAbstracts) {
        implAbstracts = getAssignment(
            This.ImplementedAbstracts,
            _ImplAbstractsLeftHand,
            _FunctionRightHand
        );
    }
    
    // The wrapper provides access only to public. Additionally all properties,
    // that are not functions are wrapped with getters and setters.
    wrapper += getAssignment(
            This.Public.Function,
            _WrapperLeftHand,
            _FunctionRightHand
        )
        + getAssignment(
            This.Public.Other,
            _WrapperLeftHand,
            _SetterFunction,
            null,
            setterKeyModificator
        )
        + getAssignment(
            This.Public.Other,
            _WrapperLeftHand,
            _GetterFunction,
            null,
            getterKeyModificator
        );
    
    // The expose wrapper is only applied if the exposeProtected flag is set.
    // It provides access to protected properties so a child class can use them.
    exposeWrapper += getAssignment(
            This.Protected.Function,
            _WrapperLeftHand,
            _FunctionRightHand,
            null,
            trimPrefix
        )
        + getAssignment(
            This.Protected.Other,
            _WrapperLeftHand,
            _SetterFunction,
            null,
            setterKeyModificator
        )
        + getAssignment(
            This.Protected.Other,
            _WrapperLeftHand,
            _GetterFunction,
            null,
            getterKeyModificator
        );
    
    // If we have a super class, than all super properties must be added to the
    // wrapper to.
    if(Super) {
        wrapper += getAssignment(
                Super.Public.Function,
                _WrapperLeftHand,
                _WrapperSuperRightHand,
                This.Overriden
            )
            + getAssignment(
                Super.Public.Other,
                _WrapperLeftHand,
                _WrapperSuperRightHand,
                This.Overriden,
                setterKeyModificator,
                setterKeyModificator
            )
            + getAssignment(
                Super.Public.Other,
                _WrapperLeftHand,
                _WrapperSuperRightHand,
                This.Overriden,
                getterKeyModificator,
                getterKeyModificator
            );
    
        exposeWrapper += getAssignment(
                Super.Protected.Function,
                _WrapperLeftHand,
                _WrapperSuperRightHand,
                This.Overriden,
                trimPrefix,
                trimPrefix
            )
            + getAssignment(
                Super.Protected.Other,
                _WrapperLeftHand,
                _WrapperSuperRightHand,
                This.Overriden,
                setterKeyModificator,
                setterKeyModificator
            )
            + getAssignment(
                Super.Protected.Other,
                _WrapperLeftHand,
                _WrapperSuperRightHand,
                This.Overriden,
                getterKeyModificator,
                getterKeyModificator
            );
    }
    
    // At last we're adding all static properties to the exports.Class-object
    statics += getAssignment(
            This.Static.Function,
            _StaticsLeftHand,
            _StaticsRightHand,
            null,
            trimPrefix
        )
        + getAssignment(
            This.Static.Other,
            _StaticsLeftHand,
            _StaticsRightHand,
            null,
            trimPrefix
        );
    
    // calling the _Code-template
    return _Code({
        "properties": properties,
        "implAbstracts": implAbstracts,
        "superConstructor": This.Init && Super? // adds the this.Super()-function to the Properties-object so we can access it in the init-function.
            superConstructor:
            "",
        "init": This.Init?
            _Init({
                "initName": This.Init
            }):
            "",
        "superConstructorCall": Super?  // calls this.Super() if it hasnt been called via the init-function.
            superConstructorCall:
            "",
        "wrapper": wrapper,
        "exposeWrapper": exposeWrapper,
        "statics": statics,
        "classFile": currentFile,
        "initConstructor": Super?
            initConstructor:
            "",
        "abstractInstanceError": _(This.Abstract).size() > 0?   // Is this class abstract? In case of, we're adding an Error that is thrown when the class is instantiated.'
            _AbstractInstanceError({
                "abstractMethodNames": '\\"' + _(This.Abstract).keys().join('\\", \\"') + '\\"',
                "classFile": currentFile
            }):
            ""
    });
}



/**
 * <p>Actually does the build. Collects all properties and super properties and
 * returns the source code.</p>
 * 
 * @private
 * @param {String} file path to the file
 * @returns {String} source
 */
function doBuild(file) {
    var classModule,
        This,
        Super,
        implAbstracts,
        src;
    
    currentFile = file;
    classModule = require(file);
    
    // To avoid exposing the full system path to the class file in the source code,
    // the currentFile variable is trimmed. Only the class path after
    // the last "node_modules" is kept.
    currentFile = currentFile.replace(/.*node_modules\//gi, '');
    
    if(!classModule
        || typeof classModule != 'object'
        || classModule instanceof Object === false
        ) {
        throw new Error('build error in ' + file + ':\nunknown class module. the passed class module is typeof ' + typeof classModule + '.');
    }
    if(!classModule.Class
        || typeof classModule.Class != 'object'
        || classModule.Class instanceof Object === false
        ) {
        throw new Error('build error in ' + file + ':\ncannot find the "Class"-property. the "Class"-property must be an object.');
    }

    This = collectProperties(classModule);
    if(typeof classModule.Extends === 'object') {
        implAbstracts = {};
        Super = collectSuperProperties(classModule.Extends, _(This).keys());
        This.Overriden = collectOverriddenProperties(This, Super);
        _(Super.Abstract).each(function eachAbstracts(value, key) {
            key = key.substr(1);
            if(classModule.Class.hasOwnProperty(key)) {
                if(typeof classModule.Class[key] === 'function') {
                    implAbstracts[key] = classModule.Class[key];
                } else {
                    throw new Error('build error in ' + file + ':\nthe implemented abstract property "' + key + '" is typeof ' + typeof classModule.Class[key] + ' instead of being typeof function.\n'
                        + 'you can only define abstract methods.');
                }
                delete Super.Abstract['?' + key];
            }
        });
        This.ImplementedAbstracts = implAbstracts;
        if(_(Super.Abstract).size() > _(This.Abstract).size()) {
            throw new Error('build error in ' + file + ':\nyou didnt take care of the inherited abstracts function(s) "' + _(Super.Abstract).keys().join('", "') + '".\n'
                + 'declare them as abstract or implement them without the "?"-prefix.');
        }
    }
    src = getSource(This, Super);
    
    return src;
}



/**
 * <p>Builds source code that can be evaled inside of the class module to get
 * a Constructor-function for the class.</p>
 * 
 * <p>Caches all builds, so that a second call will be much faster. You can
 * disable this behaviour by passing false for the second param.</p>
 * 
 * @param {String} file path to the class module
 * @param {Boolean} [cache=true] optional caching flag
 * @returns {String} source
 */
function build(file, cache) {
    if(!file || typeof file !== 'string') {
        throw new Error('build error: you havent specified a proper file path.');
    }
    if(cache === undefined) {
        cache = true;
    }
    if(cache) {
        return cacheBuild(file);
    } else {
        return doBuild(file);
    }
}

function resetCache() {
    cacheBuild = undefined;
    cacheBuild = _(doBuild).memoize();
}

resetCache();

exports.build = build;
exports.resetCache = resetCache;