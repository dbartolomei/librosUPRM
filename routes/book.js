var db = require('../utilities/database');
// var passport = require('passport');
var async = require('async');
var ObjectID = require('mongodb').ObjectID;

// create a new book
exports.newBook = function(req,res,next){
	console.log('-----')
	console.log(req); //pa ver que pasa...
	if(req.isAuthenticated()){
		db.Books.findOne({isbn10: req.body.isbn10}, function(err, book){

			if(book === null){
				aux_save(book);
			}
			else if(''+book.userID !== ''+ req.user._id){
				aux_save(book);
			}

			else if(''+book.userID === ''+ req.user._id){
				res.send(409);
			}
			else{
				res.send(400);
			}

			function aux_save(book){
					var tempTags = [];
					tempTags.push(req.body.title);
					tempTags = tempTags.concat(req.body.title.split(' '));
					tempTags = tempTags.concat(req.body.authors);
					tempTags = tempTags.concat(req.body.owner_description.split(' '));
					
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
					price : Number(req.body.price.replace(/[^0-9\.]+/g,"")),
					thumbnail : req.body.thumbnail,
					smallthumbnail : req.body.smallthumbnail,
					userID: req.user._id,
					created: Date.now(),
					isbn10: req.body.isbn10,
					isbn13: req.body.isbn13,
					tags : tempTags,
					owner_description: req.body.owner_description
				}).save(function(err, newBook){
					if(err) console.log(err);
					res.send(200);
				})
			}

		})
	}
}

exports.search = function(req,res,next){ //
	db.Books.textSearch(req.body.query,function(err, output){
		var data = {'data':[]};
			data.auth = req.isAuthenticated();

		if(output.results.length == 0 || output == null){
			res.redirect('/book/404');
		}
		
		if(err) return handleError(err);
		var inspect = require('util').inspect;

		var q_ctr = 0;
		
		for(var i = 0; i < output.results.length ;i++){
			db.Users.findById(output.results[i].obj.userID).exec(function(err,user){
				var book = {'book': output.results[q_ctr].obj, 'user': '' }
				q_ctr++;
				book.user = user;
				data.data.push(book);
				console.log(q_ctr);
				if(q_ctr == output.results.length){
					res.render('book_search_list', data);
				}
			})
		}
		
	})
}

exports.index = function(req,res,next){
	var data = {"data" : ""}
	
	db.Books.find({}).populate('userID').exec(function(err,books){
		console.log(books);
		data.data = books;
		data.auth = req.isAuthenticated();
		res.render('book_list',data);
	})
}

exports.delete = function(req,res,next){
	console.log(req.body);
	db.Books.findOneAndRemove({_id:req.body._id}, function(err,output){
		console.log(output);
		res.send(200);
	})
}

exports.single_view = function(req,res,next){
	console.log(req.params.id);
	db.Books.findById(req.params.id).populate('userID').exec(function(err, book){
		console.log(book);

		res.render('book_singleview', {'book':book, 'auth':req.isAuthenticated()});
	})
}