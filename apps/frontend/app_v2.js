const express = require('express');
const app = express();

const response_text = `
<html>
  <title>Version 2</title>
</html>
<body style="background-color: green; font-size: 60px">
  Version 2
</body>
`;

app.get('/', function(req, res) {
    res.send(response_text);
});

app.get('/version', function(req, res) {
    res.send('2');
});

app.listen(5000, function() {
    console.log('Frontend app listening on port 5000')
});

process.on('SIGINT', function() {
    process.exit();
});
