var sendgrid  = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD);


//Index route function
exports.index = function(req,res,next){
	var auth = req.isAuthenticated();
	var content = {'auth': auth};
	res.render('index', content);
}

exports.not_found = function(req,res,next){
	var auth = req.isAuthenticated();
	var content = {'auth': auth};
	res.render('book_404', content);
}

exports.feedback = function(req,res,next){
  sendgrid.send({
    to:       process.env.FEEDBACK_EMAIL,
    from:     'info@uprmbooks.com',
    subject:  'New Feedback',
    html: "<p>" +req.body.name + "</p><p>" + req.body.email + "</p><p>" + req.body.comment + "</p>"     
    }, function(err, json) {
  if (err) { return console.error(err); }
  console.log(json);
  res.redirect('/');
});

}