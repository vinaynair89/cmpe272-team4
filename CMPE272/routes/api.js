var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var session = require('express-session');

var sess;


router.get('/', function (req, res) {  
	res.send('CMPE 272 API Base. Nothing to be seen here. API page works.');  
});


mongoose.connect('mongodb://IbmCloud_tquh43sj_t83fg534_4jq4ihh5:D_ShaT44kapjLq0Urn3czn6yJqAIr6j5@ds055210.mongolab.com:55210/IbmCloud_tquh43sj_t83fg534');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {});

var VTAStopsSchema = new mongoose.Schema(
		{},
		{
			collection: 'stops'
		}
);

var Stops = db.model('stops', VTAStopsSchema);

router.get('/stops/stopId/:id', function (req, res){
	return Stops.findOne({'RTI_STOP':parseInt(req.params.id)}, function (err, singleStop) {
		if (!err) {
			return res.send(singleStop);
		} else {
			return console.log(err);
		}
	});
});


router.get('/stops/geoRange', function (req, res){
	return Stops.find(
			{
				'LONG_':
				{
					'$gt': parseFloat(req.query.long1),
					'$lt': parseFloat(req.query.long2)
				},
				'LAT':
				{
					'$gt': parseFloat(req.query.lat1),
					'$lt': parseFloat(req.query.lat2)
				}
			}
			, function (err, Stops) {
				if (!err) {
					return res.send(Stops);
				} else {
					return console.log(err);
				}
			});
});


var ApartmentsSchema = new mongoose.Schema(
		{},
		{
			collection: 'apartments'
		}
		);

var Apartments = db.model('apartments', ApartmentsSchema);

router.get('/apartments/apartmentId/:id', function (req, res){
	  return Apartments.findOne({'place_id':req.params.id}, function (err, singleApartment) {
	    if (!err) {
	      return res.send(singleApartment);
	    } else {
	      return console.log(err);
	    }
	  });
	});

router.get('/apartments/geoRange', function (req, res){
	return Apartments.find(
			{
				'geometry.location.lng':{
							'$gt': parseFloat(req.query.long1),
							'$lt': parseFloat(req.query.long2)
						},
				'geometry.location.lat':{
							'$gt': parseFloat(req.query.lat1),
							'$lt': parseFloat(req.query.lat2)
						}	
								
			}
			, function (err, apartmentsList) {
				if (!err) {
					return res.send(apartmentsList);
				} else {
					return console.log(err);
				}
			});
});

var UniversitiesSchema = new mongoose.Schema(
		{},
		{
			collection: 'universities'
		}
		);

var Universities = db.model('universities', UniversitiesSchema);

router.get('/universities', function (req, res){
	return Universities.find(
			{
				'name': new RegExp(req.query.q, "i")
			}
			, function (err, universitiesList) {
				if (!err) {
					return res.send(universitiesList);
				} else {
					return console.log(err);
				}
			});
});


var UserSchema = new mongoose.Schema(
		{
			email: String,
			accessToken: String,
			fName: String,
			lName: String,
			fb_picture: String
		},
		{
			collection: 'user'
		}
		);

var User = db.model('user', UserSchema);

/*-----Session and Auth------*/

router.post('/user/auth',function(req, res){	
	
	User.findOne({'email':req.body.email}, function (err, foundUser) {
	    if (!err) {
	    	if(foundUser!==null) {
	    		sess = req.session;
	    		sess.user = foundUser;
	    		return res.json(foundUser);
	    	}
	    	else {
	    		var insertUser = new User({
	    			email: req.body.email,
	    			accessToken: req.body.accessToken,
	    			fName: req.body.fName,
	    			lName: req.body.lName,
	    			fb_picture: req.body.fb_picture
	    		});
	    		
	    		insertUser.save(function(err, insertUser){
	    			if (err) {return console.error(err);}
	    			  	//console.dir(insertUser);
	    				sess=req.session;
	    				sess.user = insertUser;
	    				res.json(insertUser);
	    		});
	    	}
	    } else {
	    	return console.log(err);
	    }
	  });
	
});

router.get('/user/logout',function(req, res){
	sess.destroy(function(err){
		if(err){
			console.log(err);
			res.status(400).end();
		}
		else
		{
			res.clearCookie('connect.sid', { path: '/' });
			console.log("Logout successful");
			res.status(200).end();
		}
	});
});

/*-----Session and Auth ends------*/

router.post('/forwardRequest',function(req, res){
	var request = require('request');
	request(req.body.url, function (error, response, body) {
	  if (!error && response.statusCode === 200) {
	    //console.log(body); // Print the body of response.
	    res.send(body);
	  }
	});
});

module.exports = router;

