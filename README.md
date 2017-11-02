> DEPRECATED: THIS WILL NO LONGER BE UNDER DEVELOPMENT

# psychic

[![Build Status](https://travis-ci.org/gabrielcsapo/psychic.svg?branch=master)](https://travis-ci.org/gabrielcsapo/psychic)
[![Coverage Status](https://coveralls.io/repos/github/gabrielcsapo/psychic/badge.svg?branch=master)](https://coveralls.io/github/gabrielcsapo/psychic?branch=master)

Tiny single purpose view engine, help componentize your javascript. Psychic will help you make super performant UI apps.

No abstractions, limit sugar. Keep your self close to the browser, but create compostable, and reusable UIs.

Compatible with any template engine that accepts a model, and returns HTML. Use precompiled templates for blazing performance.

Compatible with AMD, CJS, or can be found at c$ if no module loader is used.

Compatible with Google Closure Compiler

## Features

* Reusable composition. (components, controls)
* Universal, works under NodeJS and the Browser
* Supports Progressive Enhancement, with Auto-Mounting
    * Render the view on the server
    * Run the client along side the server generated HTML
    * Psychic upgrades the components on the page
    * Mix with Webpack entry points for great perf
* Sugar'd APIs to help get things done
    * events
    * component communication
    * rendering
* Blazing Fast
* Tiny (1.5kb gzipped)

## Get Started

```bash
npm install psychic --save-dev
```

## Basics

Psychic tries to be ultra fast by limiting the actual representation from the declarative api, to rendered DOM elements.

We generate HTML based on your outer Control's components. Events are wired to a single rendered container, utilizing a state machine like Redux - we can achieve some crazy performance.

Extend any component at runtime using our declarative API, or leverage defining prototypes for parse time performance improvements!

Psychic helps you manage events. We rely on native event implementations, but provide a small amount of sugar to abstract on them for you. Including condensing events to a single rendered root, detaching and reattaching at render time!

Psychic has a full stack of lifeCycle events! You can listen for events that range from `afterRender`, to `beforeUpdate`.

It's amazing we fit all of this into less than 2kb of compressed space! For an additional 1kb you can bring our state machine with! That's only 3kb gzipped to get similar functionality as ReactJS + Redux!

And yes, it is universal JS compatible, and views can be rendered on the server.

## Usage

Generic Hello World

```javascript
var Component = require('psychic');

var component = new Component({
    template: function(data) { return data.message; },
    message: 'Hello World'
});

component.renderInto(document.body);
```

Compose components

```javascript
var Component = require('psychic');

var component = new Component({
    components: [
        new Component({
            template: function(){ return 'Hello World';}
        })
    ]
});

component.renderInto(document.body);
```

Another way to do hello world, we provide a default template

```javascript
var Component = require('psychic');

var component = new Component({
    innerHTML: 'Hello World'
});

component.renderInto(document.body);
```

We render components into this innerHTML for you. We collapse the representation of the DOM, and exploit the super fast innerHTML implementations developed over the years.


```javascript
var Component = require('psychic');

var component = new Component({
    template: function(data) {
        return '<chrome>' + data.innerHTML + '</chrome>';
    },
    components: [
        new Component({
            innerHTML: 'hello world'
        })
    ]
});

component.renderInto(document.body);
```

# API

Psychic currently has two core blocks to build with, `control` and `component`. A `control` is used when you expect a `component` to render. It adds a bit of extra decoration to a base component. The API is small and consists of these calls:

* `component`
 * methods
   * mix
   * listen
   * dispatch
   * destroy
 * properties
   * guid
   * $ (hashmap of child components)
* `control` (in addition to the above)
 * methods
   * update
   * renderInto
   * render
   * addClass
   * removeClass

`API EXAMPLES`

> addClass

```
var Component = require('psychic').component;
new Component({
  attributes: {
    class: 'foo'
  },
  afterRender: function() {
    this.addClass('bar');
  }
}).renderInto(document.body);
```


`var Component = require('psychic').component;`

```javascript
// mix
// mixes data into
// the component root
component.mix(data);


// component hash
// provides a quick and easy way to
// access named components.
//
// components are only hashed on render
// and not at contruction time
var component = new Component({
        name: 'myComponent'
});
component.render();
component.$.myComponent;


// guid
//
// instanced components will be provided with a guid for eventing
// this guid changes on page reload, but persists while the application
// is loaded
component.guid

// listen
//
// listen for browser events. Events are wired against outer container
// nodes. Only the root rendered control will be listening, and delegating
// to target child nodes when appropriate.
//
// listeners are tore down before every re-render. This is to encourage the
// developer to think sparingly about event usage within the view library
component.listen('click', function(e){
        console.log('this component was clicked!');
});

// listeners should be inserted using afterRender.
var component = new Component({
        afterRender: function() {
                this.listen('click', function(){});
        }
});

// listeners attach to the parent node
var component = new Component({
        components: [
            var component = new Component({
               afterRender: function() {
                   // the root rendered parent will own the click
                   // the click will be delegated to this handler
                   this.listen('click', function(){});
               }
            });   
        ]
});


/// dispatch
///
/// dispatches event that listeners are waiting to receive
/// dispatch is throttled to 1 call per 80ms. Plan accordingly. The best use of this
/// is to request the state machine to draw the view.
/// this does not influence native event dispatches, only those sent you .dispatch
///
component.listen('myevent', function(e){ console.log(e.data); });
component.dispatch('myevent', data);

/// destroy
///
/// Tears down the component, child components, event handlers, but does not
/// destroy the instance.
component.destroy();

```

`var Control = require('psychic').control;`

```javascript
/// update
///
/// updates the component's internal rendering
/// if passed data, will also call .mix, before re-rendering.
///
/// if .update is called on a parent that node will be replaced
/// in the DOM.

// with no data, just ask for a re-render, and reinsertion
// into the DOM if has a represented node.
control.update();

// send data to use before rendering and DOM swap
control.update({foo: 'bar'});


/// renderInto
///
/// Renders a control into a DOM target.
control.renderInto(document.body);


/// render
///
/// Renders the control with the currently bound data set.
/// Great for rendering on the server.
/// We also provide a view engine that does this lifting for you.
control.render();

```

## Declarative Syntax API

Components are mainly composed in Psychic using the declarative syntax. This allows natural composition that most developers are familiar with in view libraries.

```javascript
// the base default declarative syntax for a control object

var definition = {
    name: 'myComponent', // optional name for reference hashing
    tag: 'div', // root node type, default is DIV
    attributes: { // any DOM attribute to append to root node
         'class': 'red',
         'data-foo': 'bar'
    },
    afterRender: function(){}, // LifeCycle hooks
    components: [ // composition block, add components for reuse
        new Component()
    ],
    template: function(data) {
        // the template provides the innerHTML structure of the component
        // If a components block is defined on this component, data.innerHTML
        // will be populated, so you can template chrome around your components
        return 'Hello World'
    },
    innerHTML: '', // a simple string that is returned to the template, the default template renders this
    myCustomFunction: function(){} // Methods you want to travel with the component
};

// instance a new component by passing it
// the definition
var control = new Control(definition);
```

## Imperative Syntax API

Sometimes we want to extend components for reusability. We also want to get some performance gains when defining new components. Psychic leans heavily on prototypal inheritance to get some nice performance from our paradigm.

```javascript
var Control = require('psychic').control;

module.exports = function(data) {
        // do some custom stuff here
        Control.call(this, data);
};
```

## LifeCycle

Psychic provides component LifeCycle events. `wip`

Here is a list of all the LifeCycle events that can be defined

* `beforeUpdate` / `afterUpdate`
* `beforeRender` / `afterRender`
* `beforeDestroy` / `afterDestroy`
* `beforeDispatch` / `afterDispatch`

## Mounting

Psychic allows you to render components on the server, and then mount them client side. It requires little to no effort on your part.
Simply give your components a `name`.

```jsx
var Control = require('psychic').control;

module.exports = new Control({
    name: 'myMountableComponent',
    components: [
        new Control({
            name: 'myButton',
            template: <button>Click Me</button>,
            handlers: {
                'click': function(e) {
                    alert('I was clicked!');
                }
            }
        })
    ]
});
```

## Using a State Store / State Machine

It is preferential to use a State Store to maintain the state of your component. Utilizing the `FLUX` or one way data flow model, we can increase reliability and performance of our UI.
