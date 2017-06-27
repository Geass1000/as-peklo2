'use strict';

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let connection = require('../config/mongodb.database');

let itemSchema = new Schema({
	_pid : {
		type : String,
		required : true
	},
	name : {
		type : String,
		unique : true,
		required : true
	}
});

/**
 * getItem - фн.
 *
 * @function
 * @static
 *
 * @return {Array<Object>}
 */
itemSchema.statics.getItem = function () {
	return this.find().exec();
};

module.exports = connection.model('Item', itemSchema);
