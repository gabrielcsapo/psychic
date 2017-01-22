var todos = [];
var lastquery;
var filter = void(0);

module.exports = {
    viewstate: {},
    filter: function(query) {
        if (!query) {
            filter = void(0);
            return;
        }

        filter = this.find(query);
        lastquery = query;
    },
    add: function(item) {
        if (!todos) {
            todos = [];
        }
        item.status = '';
        todos.push(item);

        if (filter) {
            this.filter(lastquery);
        }

        this.save();
        this.dispatch();
    },
    get: function() {
        if (filter) {
            return filter;
        }
        return todos;
    },
    update: function(idx, props, notify) {
        for (var k in props) {
            todos[idx][k] = props[k];
        }

        this.save();

        if (filter) {
            filter = this.find(lastquery);
        }

        this.dispatch();
    },
    dispatch: function(nodraw) {
        var e = new Event('todo-store-updated');
        e.nodraw = nodraw;
        e.store = this;
        document.dispatchEvent(e);
    },
    delete: function(idx) {
        if (idx instanceof Array) {
            for (var i = idx.length - 1; i >= 0; i--) {
                todos.splice(idx[i].index, 1);
            }
        } else {
            todos.splice(idx, 1);
        }
        var e = new Event('todo-store-updated');
        e.store = this;
        this.save();
        document.dispatchEvent(e);
    },
    save: function() {
        localStorage.setItem('todos', JSON.stringify(todos));
    },
    load: function() {
        todos = JSON.parse(localStorage.getItem('todos'));
    },
    find: function(query) {
        var results = [];
        for (var i = 0; i < todos.length; i++) {
            var todo = todos[i];
            var match = true;
            for (var k in query) {
                if (todo[k] !== query[k]) {
                    match = false;
                }
            }
            if (match) {
                todo.index = i;
                results.push(todo);
            }
        }
        return results;
    }
}
