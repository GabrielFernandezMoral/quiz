var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {
				next(new Error('No existe quizId=' + quizId));
			}
		}
	).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function (req, res) {
	if(req.query.search === undefined) {
		models.Quiz.findAll().then(function (quizes) {
			res.render('quizes/index.ejs', {
				quizes: quizes,
				errors: []
			});
		});
	} else {
		var search = "%" + req.query.search + "%";
		models.Quiz.findAll({where: ["pregunta like ?", search]}).then(
			function (quizes) {
				res.render('quizes/index.ejs', {
					quizes: quizes,
					errors: []
				});
			}
		);
	}
};

// GET /quizes/:id
exports.show = function (req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		res.render('quizes/show', {
			quiz: req.quiz,
			errors: []
		});
	});
};

// GET /quizes/:id/edit
exports.edit = function (req, res) {
	var quiz = req.quiz; //autoload de instancia de quiz

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// GET /quizes/answer
exports.answer = function (req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		if(req.query.respuesta === req.quiz.respuesta) {
			res.render('quizes/answer', {
				quiz: quiz,
				respuesta: 'Correcto',
				errors: []
			});
		} else {
			res.render('quizes/answer', {
				quiz: req.quiz,
				respuesta: 'Incorrecto',
				errors: []
			});
		}
	});
};

// GET /quizes/new
exports.new = function(req, res) {
	var quiz = models.Quiz.build( //crea objeto quiz
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);

	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err) {
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			//guarda en DB los campos pregunta y respuesta de Quiz
			quiz.save({fields: ["pregunta", "respuesta"]}).then(
				function () {
					res.redirect('/quizes'); //Redirección HTTP (URL relativo) lista de preguntas
				}
			);
		}
	});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;

	req.quiz.validate().then(function(err) {
		if(err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.erros});
		} else {
			req.quiz.save({fields: ["pregunta", "respuesta"]}).then(function() {
				res.redirect('/quizes');
				//Redirección HTTP a lista de preguntas (URL relativo)
			});
		}
	})
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error) {next(error)});
};

// GET /author
exports.author = function (req, res) {
	res.render('author', { errors: []});
};