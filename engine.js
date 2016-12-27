module.exports = function (filePath, options, callback) {
  // define the template engine
    var v = require(filePath);
    if(options) v.mix(options);
    v.render();
    return callback(null, v.html);
};
