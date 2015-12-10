var Employee = require('../models/employees');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/employees');

var e = new Employee({ name:"Marcos", lastName: "Pirani", email: "marcos@marcos.com" });
e.save(function(err, doc){
    console.log(err, doc);    
});
