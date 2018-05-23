const request = require('request');
const express = require('express');
const bodyParser = require('body-parser')
const app = express();

function getEnv(key, fallback) {
    const value = process.env[key] || fallback;
    if (value) {
        return value;
    } else {
        console.log(`No environment variable ${key} provided`);
        process.exit(1);
    }
}

const backendHost = getEnv('BACKEND_HOST');
const backendPort = getEnv('BACKEND_PORT', 6000);
const backendUrl = `http://${backendHost}:${backendPort}`;

const noteForm = `
<form action="/" method="post">
Title:<br/> <input type="text" name="title" /><br />
Text:<br/> <textarea name="text"></textarea><br />
<input type="submit" value="Submit" />
</form>`;

function start(version, siteColor) {
    const titleText = `<title>Version ${version}</title>`;
    const headingText = `<h1 style="background-color: ${siteColor}; color: white">Version ${version}</h1>`;

    function getNoteTitles(callback) {
        return request(
            {
                method: 'GET',
                uri: backendUrl,
                json: true,
                headers: {
                    'X-Client-Version': version
                }
            },
            callback
        );
    }

    function getNote(title, callback) {
        return request(
            {
                method: 'GET',
                uri: `${backendUrl}/${title}`,
                json: true,
                headers: {
                    'X-Client-Version': version
                }
            },
            callback
        );
    }

    function storeNote(title, text, callback) {
        return request(
            {
                method: 'POST',
                uri: `${backendUrl}/${title}`,
                headers: {
                    'Content-Type': 'text/plain',
                    'X-Client-Version': version
                },
                body: text
            },
            callback
        )
    }

    function template(body) {
        return `<html>${titleText}</html>
<body>
${headingText}
${body}
</body>
`;
    }

    function failPage(message) {
        return template(`<p style="color: red">Error: ${message}</p>`);
    }

    function indexPage(noteTitles) {
        const renderedTitles = noteTitles
            .map((title) => `<li><a href="/${title}">${title}</a></li>`)
            .join('\n');
        return template(`<ul>${renderedTitles}</ul>${noteForm}`);
    }

    function notePage(note) {
        return template(`<h2>${note.title}</h2> <pre>${note.text}</pre> <a href="/">Go back</a>`);
    }

    function handleResponse(res, callback) {
        return function(err, backendResponse, body) {
            if (err) {
                res.status(500);
                res.send(failPage(err.code));
            } else if (backendResponse.statusCode === 200) {
                callback(body);
            } else {
                res.status(500);
                res.send(failPage('Backend failure with code ' + backendResponse.statusCode))
            }
        };
    }

    function getRoot(req, res) {
        getNoteTitles(handleResponse(res, function(body) {
            res.send(indexPage(body))
        }));
    }

    app.get('/', getRoot);

    app.post('/', bodyParser.urlencoded({extended: false}), function(req, res) {
        storeNote(req.body.title, req.body.text, handleResponse(res, function(body) {
            getRoot(req, res);
        }));
    });

    app.get('/version', function(req, res) {
        res.send(version);
    });

    app.get('/:title', function(req, res) {
        getNote(req.params.title, handleResponse(res, function(note) {
            res.send(notePage(note));
        }));
    });


    app.listen(5000, function() {
        console.log('Frontend app listening on port 5000')
    });

    process.on('SIGINT', function() {
        process.exit();
    });
}

module.exports = start;
