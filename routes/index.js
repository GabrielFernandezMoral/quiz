var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
  	title: 'Bienvenido a Quiz', 
  	subtitle: 'El portal donde podrá crear sus propios juegos!' 
  });
});

module.exports = router;
