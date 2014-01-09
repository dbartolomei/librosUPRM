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