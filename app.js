//librosRUM Web Server 

// Import module dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


// Import configurations data
var config = require('./utilities/config');
var db = require('./utilities/database');


// Function to serialize users
passport.serializeUser(function(user, done){
	done(null, user.id)
});

passport.deserializeUser(function(id, done){
	db.Users.findOne(id, function(err, user){
		done(err, user);
	});
});


//Twitter Strategy
passport.use(new TwitterStrategy({
	consumerKey: config.twitter.key,
	consumerSecret: config.twitter.secret,
	callbackURL:"/auth/twitter/callback",
	},
	function(token, tokenSecret, profile, done){
		db.Users.findOne({providerID: profile.id}, function(err, user){
			if(user){
				done(null, user);
			}
			else{
				var newUser = new db.Users({
					provider: 'twitter',
					username: profile.username,
					name: profile.displayName,
					providerID: profile.id,
					oauthToken: token,
					created: Date.now(),
					email : "",
					phone: "",
					banned: false
				}).save(function (err, newUser){
					if(err) console.log(err);
					done(null, newUser);
				});
			}
		});
	}
));

//Facebook Passport Strategy
passport.use(new FacebookStrategy({
	clientID: config.facebook.id,
	clientSecret: config.facebook.secret,
	callbackURL: "/auth/facebook/callback"
	},
	function(accessToken, refreshToken, profile, done){
		db.Users.findOne({customID: 'facebook:' + profile.id}, function(err, user){
			console.log(user);
			if(user){
				done(null,user);
			}
			else{
				var newUser = new db.Users({
					provider: 'facebook',
					username: profile.username,
					name: profile.displayName,
					providerID: profile.id,
					oauthToken: token,
					created: Date.now(),
					email : "",
					phone: "",
					banned: false
				}).save(function (err, newUser){
					if(err) console.log(err);
					done(null, newUser);
				});
			}
		});
	}
));

//server initialization
var app = express();


//server configuration
app.configure(function(){
	app.set('port', 5000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: config.secret}));
	app.use(express.methodOverride());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(app.router);
});

app.configure('development', function(){
	app.use(express.errorHandler());
});

//import of routes
require('./utilities/routes.js')(app, express);

//
http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});
