var db = require('../utilities/database');
var passport = require('passport');


module.exports = function(app,express){
	//routes calls 
	var user = require('../routes/user');
	var index = require('../routes/index');
	var book = require('../routes/book');
	

	// GET requests for main view
	app.get('/', index.index);
	// GET request for user view
	app.get('/profile', user.profile);

	// POST request for update user profile
	app.post('/saveProfile',user.profileUpdate);
	// POST request to create a new book
	app.post('/newBook', book.newBook);
	// POST request to search for books 
	app.post('/search', book.search);



	/*TWITTER AUTHENTICATION*/
	//GET Request for twitter auth
	app.get('/auth/twitter', passport.authenticate('twitter'));
	//GET request for twitter callback after auth
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/profile', failureRedirect: '/' }));


	/*TWITTER AUTHENTICATION*/
	//GET Request for facebook auth
	app.get('/auth/facebook', passport.authenticate('facebook'));
	//GET request for facebook callback after auth
	app.get('/auth/facebook/callback', passport.authenticate('facebook'), { successRedirect: '/profile', failureRedirect: '/' }));


	//logut GET request
	app.get('/logout', function(req, res){ req.logOut(); res.redirect('/');})	
}
