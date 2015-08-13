var models = require('../models/models.js');

// GET /stats
exports.stats = function (req, res) {
	var quizes,
		comments,
		averageComments,
		commentedQuizes = 0,
		uncommentedQuizes = 0;

	models.Quiz.findAndCountAll().then(function(foundQuizes) {
		quizes = foundQuizes.count;

		models.Quiz.findAndCountAll({
			include: [{model: models.Comment, required: true}]
		}).then(function(result) {
			commentedQuizes = result.count;
			uncommentedQuizes = Number(quizes)-Number(commentedQuizes);
		}).then(function() {
			models.Comment.findAndCountAll().then(function(foundComments) {
				comments = foundComments.count;
			}).then(function() {
				averageComments = Math.round(comments * 100 / quizes) / 100;

				res.render('stats', {
					quizes: quizes,
					comments: comments,
					averageComments: averageComments,
					commentedQuizes: commentedQuizes,
					uncommentedQuizes: uncommentedQuizes,
					errors: []
				});
			});
		});
	});
};