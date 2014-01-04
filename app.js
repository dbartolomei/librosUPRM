//librosRUM Web Server 

// Import module dependencies
var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var db = require('./utilities/database');
var RedisStore = require('connect-redis')(express);
var redisClient = require('redis').createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);
  	redisClient.auth(process.env.REDIS_PASSWORD, function(err) {
  		if(err) console.log(err);
    	console.log('Redis client connected');
  	});

// Import configurations data


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
	consumerKey: process.env.TWITTER_KEY,
	consumerSecret: process.env.TWITTER_SECRET,
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
	clientID: process.env.FACEBOOK_ID,
	clientSecret: process.env.FACEBOOK_SECRET,
	callbackURL: "/auth/facebook/callback"
	},
	function(token, refreshToken, profile, done){
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



//server configuration
app.configure(function(){
	app.set('port', process.env.PORT || 5000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon(__dirname + '/public/img/favicon.ico'));
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({ secret: process.env.SECRET, cookie: {maxAge: 12960000000}, store: new RedisStore({client:redisClient})}));
	// app.use(express.session({ secret: config.secret, cookie: {maxAge: 12960000000} }));
	app.use(express.methodOverride());
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static(path.join(__dirname, 'public')));
	app.use('/single_view', express.static(__dirname + '/public'));
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
