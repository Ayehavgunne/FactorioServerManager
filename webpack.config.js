const path = require('path');

module.exports = {
    mode: 'development',
    entry: './fsm/templates/js/index.js',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'fsm', 'static'),
    },
};
