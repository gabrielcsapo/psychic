this["JST"] = this["JST"] || {};

this["JST"]["templates/footer.html"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<footer id="footer" class="footer">\n    <span id="todo-count" class="todo-count"><strong>' +
((__t = ( data.itemsleft )) == null ? '' : __t) +
'</strong> items left</span>\n    <ul id="filters" class="filters">\n        <li>\n            <a class="' +
((__t = ( data.allselected )) == null ? '' : __t) +
'" href="#/">All</a>\n        </li>\n        <li>\n            <a class="' +
((__t = ( data.activeselected )) == null ? '' : __t) +
'"  href="#/active">Active</a>\n        </li>\n        <li>\n            <a class="' +
((__t = ( data.completedselected )) == null ? '' : __t) +
'" href="#/completed">Completed</a>\n        </li>\n    </ul>\n    <button id="clear-completed" class="clear-completed">Clear completed</button>\n</footer>';
return __p
};

this["JST"]["templates/header.html"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<header id="header" class="header">\n    <h1>todos</h1>\n    <input id="new-todo" class="new-todo" placeholder="What needs to be done?" autofocus>\n</header>';
return __p
};

this["JST"]["templates/main.html"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<section id="main" class="main">\n    <input id="toggle-all" class="toggle-all" type="checkbox" ' +
((__t = ( data.toggleall )) == null ? '' : __t) +
'>\n    <label for="toggle-all">Mark all as complete</label>\n    <ul id="todo-list" class="todo-list">\n        <!-- render components here -->\n        ' +
((__t = ( data.html )) == null ? '' : __t) +
'\n    </ul>\n</section>\n';
return __p
};

this["JST"]["templates/todo.html"] = function(data) {
var __t, __p = '', __e = _.escape;
__p += '<li>\n    <input type="checkbox" class="toggle" ' +
((__t = ( data.status === 'completed' ? 'checked' : '' )) == null ? '' : __t) +
'>\n    <label>' +
((__t = ( data.content )) == null ? '' : __t) +
'</label>\n    <button class="destroy"></button>\n</li>\n';
return __p
};

var _ = {escape: escape};

module.exports =this["JST"];