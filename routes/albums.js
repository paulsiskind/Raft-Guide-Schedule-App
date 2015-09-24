var express = require('express');
var router = express.Router();
var db = require('monk')('localhost/album-demo');
var albumCollection = db.get('guides');
var customerCollection = db.get('customers')

router.get('/albums', function(req, res, next) {
  albumCollection.find({}, function (err, records) {
    res.render('albums/index', {allAlbums: records});
  });
});
router.get('/albums/bookings', function(req, res, next){
  customerCollection.find({}, function(err, records){
    res.render('albums/bookings', {allCustomers: records})
  });
});

router.get('/albums/new', function(req, res, next){
  res.render('albums/new');
});

router.get('/albums/home', function(req, res, next){
  res.render('albums/home');
});

router.get('/albums/booknow', function(req, res, next){
  res.render('albums/booknow')
});

router.post('/albums/booknow', function(req, res, next){
  customerCollection.insert({ name: req.body.fullName,
                              telephone: req.body.telephone,
                              email: req.body.email,
                              groupsize: req.body.groupsize,
                              triptype: req.body.tripType,
                              date: req.body.date,
                              comments: req.body.comments});
  res.redirect('/albums/home');
});


router.post('/albums', function(req, res, next) {
  albumCollection.insert({ name: req.body.album_name,
                          email: req.body.email,
                           date: req.body.date, 
                       location: req.body.location,
                       comments: req.body.comments});
  res.redirect('/albums');
});

router.get('/albums/:id', function(req, res, next) {
  albumCollection.findOne({_id: req.params.id}, function (err, record) {
    res.render('albums/show', {theAlbum: record});
  });
});

router.post('/albums/:id/update', function(req, res, next){
  albumCollection.updateById(req.params.id,{name: req.body.album_name,
                          email: req.body.email,
                           date: req.body.date, 
                       location: req.body.location,
                       comments: req.body.comments},
                       function(err, record){
                      res.redirect('/albums');                      
  });
});

router.post('/albums/:id/delete', function(req, res, next) {
  albumCollection.remove({_id: req.params.id }, function (err, record) {
    res.redirect('/albums/');
  });
});

router.get('/albums/:id/edit', function(req, res, next){
  albumCollection.findOne({_id: req.params.id}, function (err, record) {
  res.render('albums/edit',{theAlbum: record});
 });
});


module.exports = router;