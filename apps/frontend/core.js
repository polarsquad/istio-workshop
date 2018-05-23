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

function noteForm(useEdge) {
    const useEdgeText = useEdge ? "true" : "false";
    return `
<form action="/" method="post">
Title:<br/> <input type="text" name="title" /><br />
Text:<br/> <textarea name="text"></textarea><br />
<input type="hidden" name="useEdge" value="${useEdgeText}" />
<input type="submit" value="Submit" />
</form>
`;
}

function start(version, siteColor) {
    const titleText = `<title>Version ${version}</title>`;
    const headingText = `<h1 style="background-color: ${siteColor}; color: white">Version ${version}</h1>`;

    function getNoteTitles(useEdge=false, callback) {
        return request(
            {
                method: 'GET',
                uri: backendUrl,
                json: true,
                headers: {
                    'X-Enable-Edge': useEdge
                }
            },
            callback
        );
    }

    function getNote(title, useEdge=false, callback) {
        return request(
            {
                method: 'GET',
                uri: `${backendUrl}/${title}`,
                json: true,
                headers: {
                    'X-Enable-Edge': useEdge
                }
            },
            callback
        );
    }

    function storeNote(title, text, useEdge=false, callback) {
        return request(
            {
                method: 'POST',
                uri: `${backendUrl}/${title}`,
                headers: {
                    'Content-Type': 'text/plain',
                    'X-Enable-Edge': useEdge
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

    function edgeAddOn(useEdge) {
        return useEdge ? '?useEdge=true' : '';
    }

    function failPage(message) {
        return template(`<p style="color: red">Error: ${message}</p>`);
    }

    function indexPage(noteTitles, useEdge=false) {
        const edgeLink = useEdge ? '<a href="/">Disable edge backend</a>' : '<a href="?useEdge=true">Enable edge backend</a>';
        const renderedTitles = noteTitles
            .map((title) => `<li><a href="/${title}${edgeAddOn(useEdge)}">${title}</a></li>`)
            .join('\n');
        return template(`<ul>${renderedTitles}</ul>${noteForm(useEdge)}${edgeLink}`);
    }

    function notePage(note, useEdge=false) {
        return template(
            `<h2>${note.title}</h2> <pre>${note.text}</pre> <a href="/${edgeAddOn(useEdge)}">Go back</a>`
        );
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

    function getRoot(req, res, useEdge) {
        getNoteTitles(useEdge, handleResponse(res, function(body) {
            res.send(indexPage(body, useEdge))
        }));
    }

    app.get('/', function(req, res) {
        const useEdge = req.query.useEdge || false;
        getRoot(req, res, useEdge);
    });

    app.post('/', bodyParser.urlencoded({extended: false}), function(req, res) {
        const useEdge = req.body.useEdge || false;
        storeNote(req.body.title, req.body.text, req.body.useEdge || false, handleResponse(res, function(body) {
            getRoot(req, res, useEdge);
        }));
    });

    app.get('/:title', function(req, res) {
        const useEdge = req.query.useEdge || false;
        getNote(req.params.title, useEdge, handleResponse(res, function(note) {
            res.send(notePage(note, useEdge));
        }));
    });

    app.get('/version', function(req, res) {
        res.send(version);
    });

    app.listen(5000, function() {
        console.log('Frontend app listening on port 5000')
    });

    process.on('SIGINT', function() {
        process.exit();
    });
}

module.exports = start;