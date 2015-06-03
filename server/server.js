#!/usr/bin/env node --harmony
'use strict';
const
    express = require('express'),
    app = express(),
    dbProps = ["subject", "read", "starred", "labels"],
    dbUpdateableProps = ["read", "starred", "labels"],
    emailDB = {
        emails: [
            {
                id: 0,
                subject: "This is the first email",
                read: false,
                starred: false,
                labels: ["red", "yellow"]
            },
            {
                id: 5,
                subject: "This is a Spear Phishing Attack",
                read: false,
                starred: false,
                labels: ["yellow", "blue"]
            },
            {
                id: 7,
                subject: "Buy Some Viagra",
                read: false,
                starred: true,
                labels: []
            },
            {
                id: 8,
                subject: "Help me get my inheritance",
                read: true,
                starred: true,
                labels: ["important"]
            }
        ]
    };

var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('..'));
var Schema = mongoose.Schema;

mongoose.connect('localhost', 'email');


var emailSchema = new Schema({
    subject: String,
    read: Boolean,
    starred: Boolean,
    labels: [String]
});


var updateEmailInDB = function (req, res) {
    console.log(req.body);
    var updateProperties = {};
    var Email = mongoose.model('Email', emailSchema);

    Object.keys(req.body).forEach(function (propKey) {
        // make sure evildoer doesn't add illegal properties by sending them up in the JSON
        if (dbUpdateableProps.indexOf(propKey) > -1) {
            updateProperties[propKey] = req.body[propKey];
        }
    });
    console.log(updateProperties)
    Email.update({"_id": req.body._id}, updateProperties, function (res) {
        if(err) {
            res.status(404).json({error: err, rawError: rawerror})
        } else {
            res.status(200).json({})}
    })
};

var updateEmailsInDB = function (req, res) {
    console.log(req.body);
    var updateProperties = {};
    var Email = mongoose.model('Email', emailSchema);

    Object.keys(req.body).forEach(function (propKey) {
        // make sure evildoer doesn't add illegal properties by sending them up in the JSON
        if (dbUpdateableProps.indexOf(propKey) > -1) {
            updateProperties[propKey] = req.body[propKey];
        }
    });
    console.log(updateProperties);
    Email.update({"_id": {$in: req.body.ids}}, updateProperties, {multi: true}, function (err) {
        if(err) {
            res.status(404).json(err)
        } else {
            res.status(200).json({})}
    })
};


var removeEmailFromDB = function (req, res, id) {
    var Email = mongoose.model('Email', emailSchema);

    Email.remove({"_id": id}, function (err) {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({});
        }
    });
};

var removeEmailsFromDB = function (req, res, ids) { // ids is an array of IDs to delete
    var Email = mongoose.model('Email', emailSchema);

    Email.remove({"_id": {$in: ids}}, function (err) {
        if (err) {
            res.status(404).json(err);
        } else {
            res.status(200).json({});
        }
    });
};


var addEmailToDB = function (req, res) {
    // filter request keys by valid keys
    var validKeys = Object.keys(req.body).filter(function (propKey) {
        return dbProps.indexOf(propKey) > -1;
    });
    // if we don't have all the keys, it is an error
    if (validKeys.length < dbProps.length)
        return false;
    // reduce validKeys to object with valid keys and values from request
    var newDBEntry = validKeys.reduce(function (acc, key) {
        acc[key] = req.body[key];
        return acc;
    }, {});
    // put it into the DB
    var Email = mongoose.model('Email', emailSchema);
    var email = new Email;
     Email.create(newDBEntry, function(err) {
         if(err) {
             res.status(422).json({error: "Unable to Create Document"})
         } else {
             res.status(200).json({})
         }
     })
};

var retrieveAllEmail = function (req, res) {
    var Email = mongoose.model('Email', emailSchema);

    Email.find({}, function (err, result) {
         if(err) {
            res.status(404).json(err);
        } else {
            res.status(200).json(result);
        }
        });
 };

var retrieveEmailSince = function (req, res, lastId) {
    var Email = mongoose.model('Email', emailSchema);

    Email.where('_id').gt(lastId).exec(function (err, result) {
        if(err) {
            res.status(404).json(err);
        } else {
            res.status(200).json(result);
        }
    });
};

app.get('/messages', function (req, res) {
    retrieveAllEmail(req, res);
});

app.get('/messages/:lastId', function (req, res) {
    retrieveEmailSince(req, res, req.params.lastId);
});


app.patch('/messages', function (req, res) {
    updateEmailsInDB(req, res);
});

app.delete('/messages', function(req, res) {
    removeEmailsFromDB(req, res, req.body.ids)
});

app.delete('/messages/:id', function (req, res) {
    removeEmailFromDB(req, res, req.params.id);
});

app.put('/messages', function (req, res) {
    addEmailToDB(req, res)
});

app.listen(3000, function () {
    console.log("server up")
});
