var app = module.parent.exports.app;
var Employees = require('../models/employees.js');

app.get('/panel/employees', function(req, res){
    Employees.find({}, function(err, docs){
        res.render('employees', { title: 'Employees', employees: docs});
    });
});

app.get('/panel/employees/new', function(req, res){
    res.render('new', { title: 'New Employee'});
});