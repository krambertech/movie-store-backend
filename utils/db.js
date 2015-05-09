'use strict';

var mongoose = require("mongoose");
var Q = require('q');

function DataBaseManager(url) {
	this.url = url;
}

DataBaseManager.prototype = {

	setUpConnection: function() {
		mongoose.connect('mongodb://localhost/test');
		var Schema = mongoose.Schema;

		this.actorSchema = new Schema({
			name: String,
		    surname: String
		});

		this.movieSchema = new Schema({
		    title:String,
		    year:Number,
		    format:String,
		    actors:[this.actorSchema]
		});

		this.Movie = mongoose.model('Movie', this.movieSchema);
	},

	addMovie: function(newMovie) {
		var deferred = Q.defer();
		var movie = new this.Movie({
			title: newMovie.title,
			year: newMovie.year,
			format: newMovie.format,
			actors: newMovie.actors 
		});

		movie.save(function (err, movie) {
		  if (err)  deferred.reject(err);
		  deferred.resolve('Movie added to the database');
		});
		return deferred.promise;
	},

	getAllMovies: function() {
		var deferred = Q.defer();
		this.Movie.find(function (err, movies) {
			if (err) deferred.reject(err);
			deferred.resolve(movies);
		});
		return deferred.promise;
	},

	searchActorsByQuery: function(query) {

		var deferred = Q.defer();

		var regExp = new RegExp(query+'+', "i");

		var result = [];

		this.Movie.find({
			actors: { $elemMatch: {name: regExp}}}, function (err, movies) {
			if (err) {
				deferred.reject(err);
			} else {
				result = movies;
				deferred.resolve(result);
			}			
		});
		console.log(result)
		if (result.length !== 0) {
			deferred.resolve(result);
		}

		return deferred.promise;
	
	},

	searchMoviesByQuery: function(query) {
		var deferred = Q.defer();
		console.log('aaaa')
		this.Movie.find({
			title: new RegExp(query+'+', "i")
		}, function (err, movies) {
			if (err) deferred.reject(err);
			deferred.resolve(movies);
		});

		return deferred.promise;

	},

	getMovieById: function(id) {
		var deferred = Q.defer();

		this.Movie.findById(id, function (err, movie) {
			if (err) deferred.reject(err);
			deferred.resolve(movie);
		});

		return deferred.promise;
	
	},

	deleteAllMovies: function() {
		this.Movie.find().remove().exec();
	},

	deleteMovieById: function(id) {
		var deferred = Q.defer();
		this.Movie.findById(id).remove(function(err) {
			if (err) deferred.reject(err);
			deferred.resolve('Movie deleted from the database');
		});
		return deferred.promise;
	}

};

module.exports = DataBaseManager;

