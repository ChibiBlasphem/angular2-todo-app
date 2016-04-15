'use strict';
let express = require('express'),
    app     = express(),
    statics = `${__dirname}/../client`;
    
app.use(express.static(statics));
app.set('views', statics);

// Catch-all route that always serve index.html
app.all('/*', (req, res) => {
    if (req.url.match(/\.(js|css|ico|)$/)) {
        return res.sendStatus(404);
    }
    
    res.sendFile('index.html', {root: app.settings.views});
});

// Load server listening
app.listen(3000, () => console.log('Server listening on port %d', 3000));
