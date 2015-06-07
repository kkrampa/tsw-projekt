var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Aplikacja zaliczeniowa' });
});

router.get('/rooms', function(req, res, next) {
    res.render('rooms', { rooms: []});
});

router.get('/game', function(req, res, next) {
  res.render('game', { title: 'Aplikacja zaliczeniowa' });
});

module.exports = router;
