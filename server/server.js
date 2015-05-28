#!/usr/bin/env node --harmony
'use strict';
const
  express = require('express'),
  app = express(),
  emailDB = {emails: [
                      {id: 0,
                      subject: "This is the first email",
                      read: false,
                      starred: false},
                      {id: 5,
                      subject: "This is a Spear Phishing Attack",
                      read: false,
                      starred: false},
                      {id: 7,
                      subject: "Buy Some Viagra",
                      read: false,
                      starred: false}
  ]};

  var morgan = require('morgan');
  app.use(morgan('dev'));
  app.use(express.static('..'))
  app.get('/mail', function(req, res) {
    res.json(200, emailDB);
  });
  app.listen(3000, function() {console.log("server up")});
