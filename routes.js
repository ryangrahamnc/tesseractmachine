var express = require('express');
var _ = require('lodash');
var utils = require('./lib/utils');
var Conf = require('./conf/conf.json');
var csvParse = require('csv-parse/lib/sync');

var multer = require('multer');
var autoReap = require('multer-autoreap');

var upload = multer({
    dest: './tmp',
    limits: {
        fileSize: 1 * 1024 * 1024,
    }
});

var router = express.Router();

var lastOutput = null;

router.get('/', (req, res)=>{
    res.json({
        success: true,
        buildTime: process.env.BUILD_TIME || 'unknown',
    });
});

router.post('/ocrFile', upload.single('file'), autoReap, utils.asyncMiddleware(async(req, res)=>{
    var outTime = {
        start: Date.now(),
        end: null,
    };
    console.log(req.file)
    var fileName = req.file.path;

    var result = await ocr(fileName);
    outTime.ocr = Date.now() - outTime.start;

    result = await convertOutput(result);

    outTime.csvConvert = Date.now() - outTime.start - outTime.ocr;
    outTime.end = Date.now();
    outTime.total = outTime.end - outTime.start;
    var out = {
        time: outTime,
        result,
    };
    lastOutput = out;
    console.log(11111, out)
    res.json(out);
}));

router.get('/last', utils.asyncMiddleware(async(req, res)=>{
    res.json({ lastOutput });
}));

var ocr = async(fileName)=>{
    var cmd = `tesseract "${fileName}" stdout -l eng --psm 1 --oem 3 tsv`;
    console.log(`running cmd: \`${cmd}\``);
    var result = await utils.execAsync(cmd, { silent: true });
    return result.stdout;
};

var convertOutput = async(str)=>{
    str = str.replace(/['"]/g, '\\$1');
    return csvParse(str, {
        delimiter: '\t',
        columns: true,
        skip_empty_lines: true,
    });
};


module.exports = router;

