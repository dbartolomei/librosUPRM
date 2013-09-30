//Index route function
exports.index = function(req,res,next){
	var auth = req.isAuthenticated();
	console.log(auth);
	var content = {'auth': auth};
	
	res.render('index', content);
}
