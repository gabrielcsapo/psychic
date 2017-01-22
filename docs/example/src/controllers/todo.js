var constants = require('../constants');
var store = require('../stores/todo');

document.addEventListener('click', function(event) {
    var target = event.target;

    // clear completed items
    if (target.id === 'clear-completed') {

        store.delete(store.find({
            status: 'completed'
        }));
        return;
    }

    if (target.id === 'toggle-all') {
        // get all todos from the store
        var todos = store.get();
        var status = target.checked ? 'completed' : '';

        // set view meta data we want before the store
        // notifies the view of updates to items
        store.viewstate.toggleall = target.checked ? 'checked' : '';

        // update all the todos to be completed
        for (var i = 0; i < todos.length; i++) {
            store.update(i, {
                status: status
            }, false)
        }

        return;
    }

    // if the toggle checked
    if (target.className.indexOf('destroy') > -1) {
        // update the store
        var li = target.parentNode.parentNode;
        store.delete(li.getAttribute('data-index'));
    }

    // if the toggle checked
    if (target.className.indexOf('toggle') > -1) {

        // update the store
        var li = target.parentNode;
        var status = target.checked ? 'completed' : '';

        // set the class on the DOM for animated strike through
        li.className = status;
        store.update(li.getAttribute('data-index'), {
            status: status
        }, false);
    }
}, false);

window.addEventListener('keypress', function(event) {
    if (event.keyCode === constants.ENTER_KEY) {
        if ('new-todo' === event.target.id) {
            //new todo
            var todo = event.target.value;
            store.add({
                label: todo
            });

            event.target.value = '';
        }
        return;
    }

    // focus on the new-todo input box if someone is
    // typing a todo
    document.getElementById('new-todo').focus();
}, false);

window.addEventListener('keyup', function(event) {
    if (event.keyCode === constants.ESCAPE_KEY) {

    }
}, false);

// exportable api
module.exports = {
    filter: function(query) {
        if (query) {
            store.filter(query);
            store.dispatch();
        } else {
            store.filter();
            store.dispatch();
        }
    },
    translateTodos: function(todos) {
        // creates an array of todos from the store
        var Todo = require('../components/todo');
        var components = [];
        for (var i = 0; i < todos.length; i++) {
            // create a todo item
            components.push(new Todo({
                tag: 'li',
                attributes: {
                    'class': todos[i].status,
                    'data-index': todos[i].index
                },
                status: todos[i].status,
                content: todos[i].label
            }));
        }
        return components;
    }
};
