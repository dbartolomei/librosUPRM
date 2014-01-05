//Index route function
exports.index = function(req,res,next){
	var auth = req.isAuthenticated();
	// console.log(req.user._id);
	var content = {'auth': auth};
	res.render('index', content);
}
