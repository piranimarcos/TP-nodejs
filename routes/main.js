var app = module.parent.exports.app;
var passport = module.parent.exports.passport;
var Employees = require('../models/employees.js');
var Admins = require('../models/admins.js');

app.get('/admin', function(req, res){
    var msg = req.flash('message');
    res.render('admin', { title: 'Login', flashmsg: msg});
});


app.post('/admin',function(req, res, next){
    req.flash('message', 'Error to login!'); 
    next(); 
}, 
    passport.authenticate('AdminLogin', 
    { successRedirect: '/panel/employees',
      failureRedirect: '/admin',
      failureFlash: true 
    }));


app.get('/panel/employees', function(req, res){
    var msg = req.flash('message'); // Read the flash message
    Employees.find({}, function(err, docs){
        res.render('employees', { title: 'Employees', employee: docs, flashmsg: msg}); //Pass the flash message to the view
    });
});

app.get('/panel/employees/new', function(req, res){
    req.flash('message', 'You added a new employee!'); // Save the flash message in this page
    res.render('new', { title: 'New Employee'});
});

app.post('/panel/employees/new', function(req, res){
    console.log(req.body);
    var e = new Employees({ name: req.body.name, lastName: req.body.lastName, email: req.body.email });
    e.save(function(err, doc){
        if(!err){
            res.redirect('/panel/employees');
        } else {
            res.end(err);    
        }    
    }); 
});

app.get('/panel/employees/delete/:id', function(req, res){
    req.flash('message', 'You deleted an employee'); //Save the flash message in this page
    Employees.remove({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.redirect('/panel/employees');
        } else {
            res.end(err);    
        }    
    });
});

app.get('/panel/employees/edit/:id', function(req, res){
    req.flash('message', 'you modified an employee!'); // Save the flash message in this page
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.render('edit', { title: 'Edit employee', employee: doc});
        } else {
            res.end(err);    
        }    
    });
});

app.post('/panel/employees/edit/:id', function(req, res){
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            doc.name = req.body.name; 
            doc.lastName = req.body.lastName;
            doc.email = req.body.email; 
            doc.save(function(err, doc){
                if(!err){
                    res.redirect('/panel/employees');
                } else {
                    res.end(err);    
                }    
            }); 
        } else {
            res.end(err);    
        }    
    });
});