var db = require('../utilities/database');
var passport = require('passport');

// Function to deserialize passport users 
passport.deserializeUser(function(id, done) {
  db.Users.findById(id, function(err, user) {
    done(err, user);
  }); 
});

// reate a new book
exports.newBook = function(req,res,next){
	// dummy data: 0136114997

	if(req.isAuthenticated()){ //añadir condición para verificar USERID
		db.Books.findOne({isbn10: req.body.isbn10}, function(err, book){
			console.log(tempTags);
			if(book === null){
				var tempTags = [];
					tempTags.push(req.body.title);
					tempTags = tempTags.concat(req.body.title.split(' '));
					tempTags = tempTags.concat(req.body.authors);
					
					for(var i = 0; i < req.body.authors.length; i++){
						tempTags = tempTags.concat(req.body.authors[i].split(' '));
					}
					tempTags.push(req.body.isbn10);
					tempTags.push(req.body.isbn13);

				var newBook = new db.Books({
					title: req.body.title,
					authors: req.body.authors,
					description: req.body.description, 
					condition :req.body.condition,
					price : req.body.price,
					thumbnail : req.body.thumbnail,
					smallthumbnail : req.body.smallthumbnail,
					userID: req.user._id,
					created: Date.now(),
					isbn10: req.body.isbn10,
					isbn13: req.body.isbn13,
					tags : tempTags
				}).save(function(err, newBook){
					if(err) console.log(err);
				})
			}
			else{
				console.log('duplicated');
			}
		})
	}
}

//initial implementation for the search functionality. NEED MORE WORK

exports.search = function(req,res,next){
	db.Books.textSearch(req.body.query,function(err, output){
		if(err) return handleError(err);
		var inspect = require('util').inspect;
		console.log(inspect(output, { depth: null }));
		res.redirect('/');
	})
}