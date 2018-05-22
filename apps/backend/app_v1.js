const express = require('express');
const app = express();

const version = '1';
const data = [
    {
        title: "greetings",
        text: "Hello world!"
    }
];

app.get('/', function(req, res) {
    res.json(data.map((o) => o.title));
});

app.get('/:title', function(req, res) {
    const item = data[req.params.title];
    if (item) {
        res.json(itemToResponse(item));
    } else {
        res.status(404);
        res.json({message: 'not found'})
    }
});

app.post('/:title', function(req, res) {
    res.status(501);
    res.json({message: 'unsupported'});
});

app.get('/version', function(req, res) {
    res.send(version);
});

app.listen(6000, function() {
    console.log('Backend app listening on port 6000')
});

process.on('SIGINT', function() {
    process.exit();
});
