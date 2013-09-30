//Database configuration
var mongoose = require('mongoose');
var config = require('./config');
var textSearch = require('mongoose-text-search');

//Connect to the database using the configuration url
mongoose.connect(config.databaseURL);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('DB Connected')
});

// User schema
var userSchema = new mongoose.Schema({
	provider: String,
	username: String,
	providerID: String,
	name: String,
	oauthToken: String,
	created: String,
	email: String,
	phone : Number,
	banned : Boolean
});

// Book Schema
var bookSchema = new mongoose.Schema({
	title: String,
	authors: [String],
	description: String, 
	condition: String,
	price : Number,
	tags : [String],
	thumbnail : String,
	smallThumbnail: String,
	userID: String,
	created: Date,
	isbn10: Number,
	isbn13: Number
});

bookSchema.plugin(textSearch);
bookSchema.index({tags:'text'});

// Compile the schemas into models
var Users = mongoose.model('Users', userSchema);
var Books = mongoose.model('Books', bookSchema);

// Export the models to be used
exports.Users = Users;
exports.Books = Books;

// Export mongoose
exports.mongoose = mongoose;