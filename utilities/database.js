//Database configuration
var mongoose = require('mongoose');
var textSearch = require('mongoose-text-search');
var Schema = mongoose.Schema;

mongoose.connect(process.env.MONGOHQ_URL);
// mongoose.connect(process.env.DB_URL);


var db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
	console.log('DB Connected')
});

// User schema
var userSchema = new mongoose.Schema({
	provider: String,
	username: String,
	provider_id: String,
	name: String,
	oauthToken: String,
    created: { type: Date, default: Date.now },
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
	userID: { type: Schema.Types.ObjectId, ref: 'Users' },
	created: Date,
	isbn10: Number,
	isbn13: Number,
	owner_description: String
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

