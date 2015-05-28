#!/usr/bin/env node --harmony
'use strict';
const
  express = require('express'),
  app = express(),
  emailDB = {emails: [
                      {id: 0,
                      subject: "This is the first email",
                      read: false,
                      starred: false,
                      labels: ["red", "yellow"]},
                      {id: 5,
                      subject: "This is a Spear Phishing Attack",
                      read: false,
                      starred: false,
                      labels: ["yellow", "blue"]},
                      {id: 7,
                      subject: "Buy Some Viagra",
                      read: false,
                      starred: true,
                      labels: []},
                      {id :8,
                      subject: "Help me get my inheritance",
                      read: true,
                      starred: true,
                      labels: ["important"]}
  ]};

  var morgan = require('morgan');
  app.use(morgan('dev'));
  app.use(express.static('..'))
  app.get('/mail', function(req, res) {
    res.json(200, emailDB);
  });
  app.listen(3000, function() {console.log("server up")});
