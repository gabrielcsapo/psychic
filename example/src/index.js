// import helpers
var router = require('../../router');

// load the stored todos

var store = require('./stores/todo');
store.load();

// render view
var MainView = require('./views/main');
var target = document.querySelector('#todoapp');
MainView.renderInto(target);

// application routes for todo
router.intitialize(function (route) {
    // 404
});

router.bind('/', function () {
    // set the filter which will also call the
    // store dispatch
    MainView.$.footer.setActiveFilter('all');
});

router.bind('/active', function () {
    MainView.$.footer.setActiveFilter('active');
});

router.bind('/completed', function () {
    MainView.$.footer.setActiveFilter('completed');
});


// controls first view
if (router.routes[location.pathname]) {
    router.routes[location.pathname]();
} else {
    var hash = location.hash.replace('#', '');
    if(hash.length === 0) hash = '/';
    router.change(hash);
}
