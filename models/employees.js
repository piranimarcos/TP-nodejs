var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var employeeSchema = new Schema({
    name: String,
    lastName: String,
    email: String
});

var employeeModel = mongoose.model('Employee', employeeSchema);

module.exports = employeeModel;