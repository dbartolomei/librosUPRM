//Index route function
exports.index = function(req,res,next){
	var auth = req.isAuthenticated();
	var content = {'auth': auth};
	res.render('index', content);
}
