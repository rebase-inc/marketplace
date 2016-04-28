if (process.env.NODE_ENV === 'production') {
    module.exports = require('./Code2ResumeRoot.prod');
} else {
    module.exports = require('./Code2ResumeRoot.dev');
}
