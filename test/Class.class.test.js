var expect = require('expect.js'),
    fs = require('fs'),
    Class = require('../lib/Class.class');



/*
var TestClass = new Class({
            Extends: SuperClass,
            init: function (param1, param2) {
                console.log(param1, param2);
            },
            _someProperty: "a",
            setSomeProperty: function (value) {
                this._someProperty = value;
            },
            getSomeProperty: function () {
                return this._someProperty;
            }
        });
 */









describe('TestClass', function () {

    var TestClass;

    before(function(){
        TestClass = new Class({
            someProperty : 'propertyValue',
            _constructorCalled : false,
            _privateProperty : 'privateValue',
            init: function (param1) {
                //mark class as instantiated
                console.log('init called!');
                this._constructorCalled = true;
            },
            getParam1: function (value) {
                return(this.someProperty);
            },
            setParam1: function(newValue){
                return this.someProperty = newValue;
            },
            doesExist : function(){
                return this._constructorCalled;
            }
        });
    });

    it('should be an object after creation', function () {

        var myTestClass = TestClass('param1Value');
        expect(myTestClass).not.to.be.a('undefined');
        //expect(myTestClass.doesExist()).to.be(true);
    });

    it('should have the defined method', function () {
        var myTestClass = new TestClass('param1Value');
        expect(myTestClass.getParam1).to.be.a('function');
    });

    it('should return properties via defined methods', function(){
        var myTestClass = new TestClass('param1Value');
        expect(myTestClass.getParam1()).to.equal('propertyValue');
    });

    it('properties should be settable via setter', function(){
          var myTestClass = new TestClass('constructPropertyValue');
          myTestClass.setParam1("newValueHere");
          expect(myTestClass.getParam1()).to.equal('newValueHere');
    });

});