'use strict';

var rewire = require('rewire');
var expect = require('chai').expect;
var Control = rewire('../index');

describe('psychic', function () {

    it('should intitialize and stand inert', function (done) {
        expect(Control).to.exist;
        done();
    });

    it('should crete a new component, with a template function', function (done) {
        var component = new Control({
            template: function () {
                return 'hello world';
            }
        });
        component.listen('test');

        expect(component.template).to.exist;
        done();
    });

    it('should create a listener without erroring on server', function (done) {
        var component = new Control({
            template: function () {
                return 'hello world';
            }
        });

        component.listen('test');
        expect(component.events).to.exist;
        expect(component.events[0].type).to.equal('test');
        done();
    });

    describe('Should render components on the server', function () {

        it('should return HTML of foo via serverside rendering', function (done) {
            var component = new Control({
                html: 'foo'
            });

            component.render();

            expect(component.html).to.contain('foo');
            done();
        });

        it('should update HTML of foo to baz', function (done) {
            var component = new Control({
                html: 'foo'
            });

            component.render();
            component.update({
                html: 'baz'
            });

            expect(component.html).to.contain('baz');
            done();
        });

        it('should append show message if correct template is passed', function (done) {
            var component = new Control({
                template: function (data) {
                    return '<div>' + data.message + '</div>';
                },
                message: 'foo'
            });

            component.render();

            expect(component.html).to.contain('foo');
            done();
        });

        it('should append a logger error if incorrect template is passed', function (done) {
            var component = new Control({
                template: function (data) {
                    return data.message;
                },
                message: 'foo'
            });

            try {
                component.render();
            } catch(ex) {
                expect(ex.toString()).to.equal("TypeError: Cannot read property 'children' of undefined")
            }

            expect(component.log[0]).to.equal('Error: The template could not generate proper html');
            done();
        });

        it('should render the Control inside components array as a nested div', function (done) {
            var component = new Control({
                components: [
                    new Control({
                        html: 'foo'
                    })
                ]
            });

            component.render();

            expect(component.html).to.contain('>foo</div></div>');
            done();
        });


        it('should render components with attributes', function (done) {
            var component = new Control({
                components: [
                    new Control({
                        attributes: {
                            style: 'width:100%;'
                        },
                        html: 'foo'
                    })
                ]
            });

            component.render();

            expect(component.html).to.contain('<div style="width:100%;"');
            done();
        });

        it('should render components, and put named components into $ hash', function (done) {
            var component = new Control({
                name: 'myComponent',
                components: [
                    new Control({
                        name: 'myOtherComponent',
                        components: [
                            new Control({
                                name: 'anotherMyOtherComponent'
                            })
                        ]
                    }),
                    new Control({
                        name: 'anotherComponent'
                    })
                ]
            });

            component.render();

            expect(component.name).to.equal('myComponent');
            expect(component.$.myOtherComponent).to.equal(component.components[0]);
            expect(component.$.anotherComponent).to.equal(component.components[1]);
            expect(component.$.myOtherComponent.$.anotherMyOtherComponent).to.equal(component.components[0].components[0]);

            done();
        });

        it('should destroy component on server side', function (done) {
            var component = new Control({
                components: [
                    new Control({
                        html: 'foo'
                    })
                ]
            });
            component.render();
            component.destroy();

            expect(component.html).to.equal(void(0));
            done();
        });

        it('should destroy component even without a components block', function (done) {
            var component = new Control({
                html: 'foo'
            });
            component.render();
            component.destroy();

            expect(component.html).to.equal(void(0));
            done();
        });

        it('should invoke a function passed in transform', function (done) {
            var component = new Control({
                name: 'foo',
                transform: function () {
                    this.name = 'bar';
                }
            });
            component.render();
            expect(component.name).to.equal('bar');
            done();
        });

        it('should append the name of the parent with no mount to the mount of the child', function (done) {
            var component = new Control({
                name: 'A',
                parent: {
                    name: 'B'
                }
            });
            component.render();

            expect(component.mount).to.equal('B_A');
            done();
        });

        it('should keep mount unchanged if somehow name changes to null or undefined', function (done) {
            var component = new Control({
                name: 'foo'
            });
            var component1 = component.render();
            component.name = null;
            var component2 = component.render();

            expect(component1).to.equal(component2);
            done();
        });
    });


    describe('Should render components on the client', function () {
        var component, modControl;

        beforeEach(function () {
             this.jsdom = require('jsdom-global')()
            document.body.innerHTML = '';
            Control.__set__({
                document: document
            });
            modControl = require('../index');
            document.body.innerHTML = '';
            component = new modControl({
                attributes: {
                    foo: 'bar'
                },
                afterRender: function () {},
                components: [
                    new Control({
                        name: 'testControl',
                        attributes: {
                            foo: 'bar'
                        },
                        html: 'foo',
                        afterRender: function () {}
                    })
                ]
            });
        });

        it('should return a component with a nested div tag', function (done) {
            component.renderInto(document.body);
            var expected = '<div foo="bar"><div foo="bar">foo</div></div>';
            expect(component.html).eql(expected);
            done();
        });

        it('should mix an object on a component', function (done) {
            component.mix({
                attributes: {
                    foo: 'baz'
                }
            });

            expect(component.attributes.foo).eql('baz');
            done();
        });

        it('should attach a logger message when an illegible template is passed', function (done) {
            component.template = function () {
                return '<foo';
            };
            try {
                component.renderInto(document.body);
            } catch (e) {
                expect(component.log[0]).to.equal('Error: The template could not generate proper html');
            }
            done();
        });

        it('should mount a component', function (done) {
            var component = new modControl({
                name: 'testControl',
                html: 'test'
            });

            document.body.innerHTML = '<div data-guid="d2ff7011-075a-e381-0973-c001c9077fd4" data-psychic-mount="testControl">undefined</div>';
            var node = document.querySelectorAll('[data-psychic-mount=testControl]');
            component.renderInto(document.body);
            component.update();
            expect(component.node.html).eql(node.html);
            done();
        });

        it('should mount a component', function (done) {
            var component = new modControl({
                name: 'testControl',
                components: [
                    new modControl({
                        name: 'subControl',
                        components: [
                            new modControl({
                                name: 'otherSubControl'
                            })
                        ]
                    })
                ]
            });

            component.renderInto(document.body);
            expect(component.node.outerHTML).eql(component.html);
            done();
        });

        it('should test adding attributes to a split tag', function (done) {
            var component = new modControl({
                name: 'testControl',
                template: function () {
                    return '<div id="test"></div>';
                }
            });


            component.renderInto(document.body);

            expect(component.node.outerHTML).eql(component.html);
            done();
        });


        it('should dispatch on a component', function (done) {

            var component = new modControl({
                name: 'testControl',
                handlers: {
                    myMessage: function (e) {
                        e.data.done();
                    }
                }
            });

            component.renderInto(document.body);

            component.dispatch('myMessage', {
                done: done
            });

        });

        it('should dispatch on a child component', function (done) {

            var component = new modControl({
                name: 'myComponent',
                components: [
                    new modControl({
                        name: 'testControl',
                        handlers: {
                            myMessage: function (e) {
                                e.data.done();
                            }
                        }
                    })
                ]
            });

            component.renderInto(document.body);

            component.$.testControl.dispatch('myMessage', {
                done: done
            });

        });

        it('should listen dispatch on a component with no node', function (done) {
            var component = new modControl({
                name: 'testControl',
                html: 'test'
            });

            component.listen('test', function(e) {
                e.data.done();
            });

            component.dispatch('test', {
                done: done
            });
        });

        it('should dispatch the component immediately on a component', function (done) {

            var component = new modControl({
                name: 'testControl',
                handlers: {
                    myMessage: function (e) {
                        e.data.done();
                    }
                }
            });

            component.renderInto(document.body);

            component.dispatch('myMessage', {
                done: done
            });
            component.renderInto(document.body);
            component.dispatchImmediate('mymessage', {
                done: done
            });
        });

        it('should destroy component on client side', function (done) {
            component.renderInto(document.body);
            component.destroy();
            expect(component.html).to.equal(void(0));
            done();
        });

        it('should update content of component', function (done) {
            component.renderInto(document.body);
            var child = component.components[0];
            child.update({
                html: 'bar'
            });
            component.update();
            expect(component.html).to.equal('<div><div><div>bar</div></div></div>');
            done();
        });

        it('should add a class to the component', function (done) {
            var component = new modControl({
                attributes: {
                    class: 'bar'
                },
                html: 'foo'
            }).renderInto(document.body);
            expect(component.node.getAttribute('class')).to.equal('bar');
            component.addClass('foo');
            expect(component.node.getAttribute('class')).to.equal('bar foo');
            done();
        });

        it('should remove a class from the component', function (done) {
            var component = new modControl({
                attributes: {
                    class: 'bar'
                },
                html: 'foo'
            }).renderInto(document.body);
            expect(component.node.getAttribute('class')).to.equal('bar');
            component.addClass('foo');
            expect(component.node.getAttribute('class')).to.equal('bar foo');
            component.removeClass('foo');
            expect(component.node.getAttribute('class').toString()).to.equal('bar');
            done();
        });

        it('should not break and change anything when attempting to destroy components multiple times', function (done) {
            component = new modControl({});
            component.renderInto(document.body);
            var component1 = component.destroy();
            var component2 = component.destroy();
            expect(component1).to.deep.equal(component2);
            done();
        });

        it('should set components to empty array if none are set before render', function (done) {
            var component = new modControl({
                html: 'foo'
            });
            expect(component.components.length).to.equal(0);
            done();
        });

        it('should set components to empty array if none are set after render', function (done) {
            var component = new modControl({
                html: 'foo'
            });
            component.renderInto(document.body);
            expect(component.components.length).to.equal(0);
            done();
        });

        it('should remove listeners when attempting to destroy component', function (done) {
            var component = new modControl({
                template: function () {
                    return '<hello world/>';
                }
            });
            component.listen('test');
            component.listen('test2');

            component.destroy();
            expect(component.events.length).to.equal(0);
            done();
        });

        it('should destroy component even without a components block', function (done) {
            var component = new modControl({
                html: 'foo'
            });
            component.renderInto(document.body);
            component.destroy();

            expect(component.html).to.equal(void(0));
            done();
        });
    });
});
