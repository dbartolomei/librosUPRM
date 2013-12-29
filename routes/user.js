//Functions to handle most routes
var db = require('../utilities/database');
var passport = require('passport');

passport.deserializeUser(function(id, done) {
  db.Users.findById(id, function(err, user) {
    done(err, user);
  }); 
});


/*
* Render the user profile
*/
exports.account = function(req, res, next){
	if(req.isAuthenticated()){
		db.Users.findOne({_id: req.user._id}, function(err, user){
			db.Books.find({userID: req.user._id}, function(err, books){
				var data = {};
				data.user = user;
				data.books = books;
				data.auth = true;
				console.log(data);
				res.render('account', data);
			})
		})
	}
	else{
		req.session.returnTo = req.route.path;
		res.redirect('/');
	}
}

exports.profileUpdate = function(req,res,next){
	if(req.isAuthenticated()){
		console.log(req.body);
		// console.log(req);
		db.Users.findOne({_id: req.user._id}, function(err, user){
			console.log(user);
			user.name = req.body.name;
			var phone = req.body.phone.replace(/[^\d]/g, "");
			user.email = req.body.email;
			user.phone = phone;
			user.save(function(err, data){
				if(err){
						console.log(err);
						next();
						res.json(400);
					}
			
					res.redirect('/account')
			})
		})
	}
}
/*
* Render the user settings page
*/
exports.userData = function(req, res, next){
	if(req.isAuthenticated()){
		data = {
			email : req.user.email,
			phone : req.user.phone
		}
		data.authentification = true;
		res.render('profile', data);
	}
	else{
		req.session.returnTo = req.route.path;
		res.redirect('/signin');
	}		
}

