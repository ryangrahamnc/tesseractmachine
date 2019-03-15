var shelljs = require('shelljs');
var _ = require('lodash');

var execAsync = (cmd, options={})=>{
    if(!options.silent){
        console.log(`running cmd ${cmd}`);
    }
    options.async = true;
    return new Promise((resolve, reject)=>{
        shelljs.exec(cmd, options, (code, stdout, stderr)=>{
            var result = { code, stdout, stderr, };
            resolve(result);
        });
    });
};

var asyncMiddleware = (fn)=>{
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

module.exports = {
    execAsync, asyncMiddleware,
};
