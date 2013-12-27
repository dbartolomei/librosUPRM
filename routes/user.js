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
var profile = function(req, res, next){
	// var auth = req.isAuthenticated();
	// console.log(auth);
	// var content = {'auth': auth};
	
	if(req.isAuthenticated()){
		db.Users.findOne({_id: req.user._id}, function(err, user){
			db.Books.find({userID: req.user._id}, function(err, books){
				var data = {};
				data.user = user;
				data.books = books;
				// console.log(data);
				data.auth = true;
				console.log(data);
				res.render('profile', data);
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
				else
					res.redirect('/profile')
			})
		})
	}
}
/*
* Render the user settings page
*/
var userData = function(req, res, next){
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

/*
* Render view to submit a new entry
*/
var newEntry = function(req, res, next){
	if(req.isAuthenticated()){
		if(req.user.email === ""){
			res.redirect('/perfil');
		}
		else{
		var currentFile = {};
		currentFile.authentification = true;
		res.render('newEntry', currentFile);
		}
	}
	else{
		req.session.returnTo = req.route.path;
		res.redirect('/entrar');
	}
}

/*
* Render the sign in view
*/
var signIn = function(req,res){
	if(req.isAuthenticated()){
		res.redirect('/galeria');
	}
	else{
		res.render('signin');
	}
}


//Export Functions
exports.newEntry = newEntry;
exports.signIn = signIn;
exports.profile = profile;
exports.userData = userData;
