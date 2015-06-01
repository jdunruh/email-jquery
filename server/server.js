#!/usr/bin/env node --harmony
'use strict';
const
  express = require('express'),
  app = express(),
    dbProps = ["id", "subject", "read", "starred", "labels"],
    dbUpdateableProps = ["read", "starred", "labels"],
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

  var bodyParser = require('body-parser');
  var morgan = require('morgan');
  var mongoose = require('mongoose');
  app.use(bodyParser.json());
  app.use(morgan('dev'));
  app.use(express.static('..'));
    var Scheam = moongoose.Schema;

  mongoose.connect('localhost', 'gettingstarted');


    var emailSchema = new Schema({
        id: Number,
        subject: String,
        read: Boolean,
        starred: boolean
        labels: [String]
    });

var Email = mongoose.model('Email', emailSchema);



  var findID = function(db, id) { // returns the index into DB for the id
    for(var i = 0; i < db.emails.length; i++) {
      if(db.emails[i].id === id)
        return i;
    }
  }

  var updateDB = function(req) {
      console.log(req.body);
    var id = findID(emailDB, req.body.id);
      Object.keys(req.body).forEach(function (propKey){
              // make sure evildoer doesn't add properties by sending them up in the JSON
              if(dbUpdateableProps.indexOf(propKey) > -1) {
                  emailDB.emails[id][propKey] = req.body[propKey];
              }
          });
      }

  var removeEmailFromDB = function(req) {
    let id = findID(emailDB, req.params.id);
    emailDB.emails.splice(id, 1);
}

  var addEmailToDB = function(req) {
      // filter request keys by valid keys
      var validKeys = Object.keys(req.body).filter(function(propKey) {
          return dbProps.indexOf(propKey) > -1;
          });
      // if we don't have all the keys, it is an error
      if(validKeys.length < dbProps.length)
         return false;
      // reduce validKeys to object with valid keys and values from request
      var newDBEntry = validKeys.reduce(function(acc, key) {
           acc[key] = req.body[key];
          return acc;
      }, {});
      // put it into the DB
      emailDB.emails[emailDB.emails.length] = newDBEntry;
      return true;
  }

  app.get('/messages', function(req, res) {
    res.json(200, emailDB);
  });
  app.patch('/messages', function(req, res) {
    updateDB(req);
    res.json(200, {});
  });
  app.delete('/messages/:id', function(req, res) {
      removeEmailFromDB(req);
      res.json(200, {});
  });
  app.put('/messages', function(req, res) {
      if(addEmailToDB(req))
          res.json(200, {});
      else
          res.json(422, {error: "Illegal or Missing Keys"});
  });
  app.listen(3000, function() {console.log("server up")});
