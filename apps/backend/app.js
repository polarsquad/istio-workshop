const loki = require('lokijs');
const express = require('express');
const bodyParser = require('body-parser')

// HTTP
const app = express();
app.use(bodyParser.json());

// DB
const db = new loki('loki.json');
const stuff = db.addCollection('stuff');

app.get('/', function(req, res) {
    res.json(stuff.find());
});

app.get('/:key', function(req, res) {
    const items = stuff.find({key: req.params.key});
    if (items.length > 0) {
        res.json(items);
    } else {
        res.status(404);
        res.json({message: 'not found'})
    }
});

app.post('/:key', function(req, res) {
    if (req.body.value) {
        stuff.insert({key: req.params.key, value: req.body.value});
        res.json({message: 'success'});
    } else {
        res.status(400);
        res.json({message: 'missing value'});
    }
});

app.listen(5000, function() {
    console.log('Backend app listening on port 5000')
});

process.on('SIGINT', function() {
    process.exit();
});
