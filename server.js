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
	console.log('/movies');

	db.getAllMovies().then(function(data){
		res.send(data);
	});	
	
});

app.get('/movies/:search', function(req, res) {
	console.log('/movies/:search');
	var query = req.params.search;

	if (query === '') {
		db.getAllMovies().then(function(data){
			res.send(data);
		});
	} else {
		db.searchMoviesByQuery(query).then(function(data){
			res.send(data);
		});	
	}
	
});

app.get('/actors/:search', function(req, res) {
	var query = req.params.search;

	console.log('/actors/:search');

	if (query === '') {
		db.getAllMovies().then(function(data){
			res.send(data);
		});
	} else {
		db.searchActorsByQuery(query).then(function(data){
			res.send(data);
		});	
	}
	
});

app.post('/addmovie', function(req, res) {
	console.log('/addmovie');
	db.addMovie(req.body).then(function(data){
		res.send(true);
	});
});

app.post('/deletemovie', function(req, res) {
	console.log('/deletemovie');
	db.deleteMovieById(req.body.id).then(function(data){
		console.log('promise, then')
		res.send(true);
	});
});

app.get('/getmoviedetails', function(req, res) {
	var id = req.query.id;
	console.log('/getmoviedetails');
	db.getMovieById(id).then(function(data){
		res.send(data);
	});

	
});

var server = app.listen(9125, function() { 
	var port = server.address().port;
	console.info('Server is up and running on port ', port);
});

