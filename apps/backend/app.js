const loki = require('lokijs');
const express = require('express');
const bodyParser = require('body-parser')

// HTTP
const app = express();

// DB
const db = new loki('loki.json');
const stuff = db.addCollection('stuff');

function getByTitle(title) {
    return stuff.find({title: title})[0];
}

function upsert(title, text) {
    const item = getByTitle(title);
    if (item) {
        stuff.findAndUpdate({title: title}, function(o) {
            o.text = text;
            return o;
        });
    } else {
        stuff.insert({title: title, text: text});
    }
}

function getTitles() {
    return stuff.find().map((o) => o.title);
}

function itemToResponse(item) {
    return {
        title: item.title,
        text: item.text
    };
}

app.get('/', function(req, res) {
    res.json(getTitles());
});

app.get('/:title', function(req, res) {
    const item = getByTitle(req.params.title);
    if (item) {
        res.json(itemToResponse(item));
    } else {
        res.status(404);
        res.json({message: 'not found'})
    }
});

app.post('/:title', bodyParser.text(), function(req, res) {
    if (typeof req.body === 'string') {
        upsert(req.params.title, req.body);
        res.json({message: 'success'});
    } else {
        res.status(400);
        res.json({message: 'missing text'});
    }
});

app.listen(6000, function() {
    console.log('Backend app listening on port 6000')
});

process.on('SIGINT', function() {
    process.exit();
});
