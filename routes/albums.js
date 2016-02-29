require('dotenv').load();
var express = require('express');
var router = express.Router();
var db = require('monk')(process.env.MONGOLAB_URI);
var albumCollection = db.get('guides');
var customerCollection = db.get('customers')

var Users = db.get('users');
var bcrypt = require('bcrypt')




router.get('/albums', function(req, res, next) {
  albumCollection.find({}, function (err, records) {
    var username = req.session.username;
    console.log(username)
    res.render('albums/index', {allAlbums: records, username: username});
  });
});
router.get('/albums/bookings', function(req, res, next){
  customerCollection.find({}, function(err, records){
    var username = req.session.username;
    res.render('albums/bookings', {allCustomers: records, username: username})
  });
});

router.get('/albums/new', function(req, res, next){
  var username = req.session.username;
  res.render('albums/new', {username: username});
});

router.get('/home', function(req, res, next){
  res.render('albums/home');
});

router.get('/booknow', function(req, res, next){
  res.render('albums/booknow')
});
router.get('/albums/newBooking', function(req, res, next){
  var username = req.session.username;
  res.render('albums/newBooking', {username: username});
});

router.post('/albums/booknow', function(req, res, next){
  customerCollection.insert({ name: req.body.fullName,
                              telephone: req.body.telephone,
                              email: req.body.email,
                              groupsize: req.body.groupsize,
                              triptype: req.body.tripType,
                              date: req.body.date,
                              comments: req.body.comments
                           });
  res.redirect('/home');
});

router.post('/albums/newBooking', function(req, res, next){
  customerCollection.insert({ name: req.body.fullName,
                              telephone: req.body.telephone,
                              email: req.body.email,
                              groupsize: req.body.groupsize,
                              triptype: req.body.tripType,
                              date: req.body.date,
                              comments: req.body.comments
                           });
  res.redirect('albums/bookings');
});


router.post('/albums', function(req, res, next) {
  albumCollection.insert({ name: req.body.album_name,
                          email: req.body.email,
                           date: req.body.date, 
                       location: req.body.location,
                       comments: req.body.comments,
                      locationb: req.body.locationb,
                      commentsb: req.body.commentsb});
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
                       comments: req.body.comments,
                      locationb: req.body.locationb,
                      commentsb: req.body.commentsb},
                       function(err, record){
                      res.redirect('/albums');                      
  });
});

router.post('/albums/:id/updateBooking', function(req, res, next){
  customerCollection.updateById(req.params.id,{name: req.body.fullName,
                              telephone: req.body.telephone,
                              email: req.body.email,
                              groupsize: req.body.groupsize,
                              triptype: req.body.tripType,
                              date: req.body.date,
                              comments: req.body.comments},
                              function(err, data){
                           res.redirect('/albums/bookings');
  });
});
router.post('/albums/:id/deleteBooking', function(req, res, next){
  customerCollection.remove({_id: req.params.id}, function(err, data){
    res.redirect('/albums/bookings')
  })
})

router.post('/albums/:id/delete', function(req, res, next) {
  albumCollection.remove({_id: req.params.id }, function (err, record) {
    res.redirect('/albums/');
  });
});

router.get('/albums/:id/edit', function(req, res, next){
  albumCollection.findOne({_id: req.params.id}, function (err, record) {
  res.render('albums/edit',{theAlbum: record, user: req.user});
 });
});

router.get('/albums/:id/editBookings', function(req, res, next){
  customerCollection.findOne({_id: req.params.id}, function(err, data){
    res.render('albums/editBookings',{theCustomer: data, user: req.user});
  });
});

     /*below this line is the login routes*/

router.get('/', function(req, res, next){
  res.redirect('/register');
});

router.get('/signin', function(req, res, next){
  res.render('signin')
});

router.get('/register', function(req, res, next){
  var username = req.session.username;
  res.render('index', {username: username});
});

router.get('/login', function(req, res, next){
  res.render('login');
});

router.get('/signout', function(req, res, next){
  req.session = null;
  res.redirect('/signin');
});


router.post('/', function(req, res, next){
  var hash = bcrypt.hashSync(req.body.password, 12);
  var errors = [];
  if(req.body.email == 0){
    errors.push('Email cannot be blank!')
  }
  if(req.body.password.length == 0){
    errors.push('Password Cannot be blank!');
  }
  if(req.body.password.length < 8){
    errors.push('Password Must be atleast 8 characters!')
  }
  re = /[0-9]/;
  if(!re.test(req.body.password)){
    errors.push('Password Must Contain at least One Number!')
  }
  // de = /[@#$%^&+=]/;
  // if(!de.text(req.body.password)){
  //   errors.push('Password Must Contain at least one Special Character!')
  // }
  if(req.body.password !== req.body.confirmation){
    errors.push('Password does not match confirmation')
  }
  if(errors.length){
    res.render('login', {errors:errors})
  }
  else{
    Users.find({email: req.body.email.toLowerCase()}, function(err, data){
      if(data.length > 0){
        errors.push('Email Already in Exists!');
        res.render('login', {errors:errors});
      }
      else{
        Users.insert({email: req.body.email.toLowerCase(), passwordDigest:hash}, function(err, data){
          req.session.username = req.body.email;
          res.redirect('/albums')
        });
      }
    });
  }
});

router.post('/signin', function(req, res, next){
  var errors = [];
  if(req.body.email.length == 0){
    errors.push('Email Cannot be Blank!')
  }
  if(req.body.password.length == 0){
    errors.push('Password Cannot be Blank!')
  }
  if(errors.length){
    res.render('signin', {errors: errors})
  }
  else{
    Users.findOne({email: req.body.email}, function(err, data){
      if(data){
        if(bcrypt.compareSync(req.body.password, data.passwordDigest)){
          req.session.username = req.body.email;
          res.redirect('/albums')
        }
        else{
          errors.push("Invalid Email/Password");
          res.render('signin', {errors: errors})
        }
      }else{
        errors.push('Email Does not Exist');
        res.render('signin', {errors: errors})
      }
    });
  }

});



module.exports = router;