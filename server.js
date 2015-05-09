var express = require("express");
var cors = require("cors");
var bodyParser = require('body-parser');

var DataBaseManager = require('./utils/db.js');

db = new DataBaseManager('');

db.setUpConnection();


var app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/movies', function(req, res) {
	console.log('got /movies');

	db.getAllMovies().then(function(data){
		res.send(data);
	});	
	
});

app.get('/search/:search', function(req, res) {
	console.log('/search/', req.params.search);
	var query = req.params.search;

	if (query === '') {
		db.getAllMovies().then(function(data){
			res.send(data);
		});
	} else {
		db.searchByQuery(query).then(function(data){
			res.send(data);
		});	
	}
	
});

app.post('/addmovie', function(req, res) {
	console.log('/addMovie', req.body);
	db.addMovie(req.body).then(function(data){
		res.send(true);
	});
});

app.post('/deletemovie', function(req, res) {
	console.log('/deletemovie', req.body.id);
	db.deleteMovieById(req.body.id).then(function(data){
		console.log('promise, then')
		res.send(true);
	});
});

app.get('/getmoviedetails', function(req, res) {
	var id = req.query.id;
	console.log('/getmoviedetails', req.query.id);
	db.getMovieById(id).then(function(data){
		res.send(data);
	});

	
});



var server = app.listen(9125, function() { 
	var port = server.address().port;
	console.info('Server is up and running on port ', port);
});

db.searchByQuery('blaz');	