var db = require('../utilities/database');
var passport = require('passport');


module.exports = function(app,express){
	//routes calls 
	var user = require('../routes/user');
	var index = require('../routes/index');
	var book = require('../routes/book');
	 

	app.get('/', index.index);						// GET main view
	app.get('/account', user.account);				// GET user view
	app.get('/books',book.index);
	app.get('/books/name', book.sort_name);			// GET all listed books
	app.get('/books/price', book.sort_price);	
	app.get('/book/404', index.not_found);

	
	app.post('/saveProfile',user.profileUpdate);	// POST update user profile	
	app.post('/search', book.search);				// POST (search) for books 
	
	app.post('/book/new', book.newBook);				// POST a new book			
	app.post('/book/delete', book.delete);			//DELETE a book especified by book_id

	app.get('/book/:id',book.single_view);

	
	/*TWITTER AUTHENTICATION*/
	app.get('/auth/twitter', passport.authenticate('twitter'));  //GET Request for twitter auth
	app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/account', failureRedirect: '/' })); //callback

	/*FACEBOOK AUTHENTICATION*/
	app.get('/auth/facebook', passport.authenticate('facebook')); 	//GET Request for facebook auth
	app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/account', failureRedirect: '/' })); 	//GET Request for facebook auth

	//logut GET request
	app.get('/logout', function(req, res){ req.logOut(); res.redirect('/');})	
}
