var app = module.parent.exports.app;
var passport = module.parent.exports.passport;
var Employees = require('../models/employees.js');
var Admins = require('../models/admins.js');

//securizar rutas
var adminAuth = function(req, res, next){
    //authorize role
    if(typeof req.user != "undefined"){
        next();
    }else{
        //Not authorized redirect
        res.redirect('/');
    }
}

app.use(function(req, res, next) {
    res.locals.user = req.user;
    next();
});

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

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


app.get('/panel/employees', adminAuth, function(req, res){
    var msg = req.flash('message'); // Read the flash message
    Employees.find({}, function(err, docs){
        res.render('employees', { title: 'Employees', employee: docs, flashmsg: msg}); //Pass the flash message to the view
    });
});

//parte de pedido por ajax
app.get('/employees/search/:name', function(req, res){
    Employees.find({ name: new RegExp(".*"+req.params.name+".*") })
        //.populate('sueldo')
        //.limit(10)
        .select('-password')
        //.skip(4)
        .exec( function(err, docs){
           res.json(docs); 
    });
    
});

app.get('/panel/employees/new', adminAuth, function(req, res){
    req.flash('message', 'You added a new employee!'); // Save the flash message in this page
    res.render('new', { title: 'New Employee'});
});

app.post('/panel/employees/new', adminAuth, function(req, res){
    console.log(req.body);
    if (req.body.password === req.body.confirm) {
        var e = new Employees({ name: req.body.name, lastName: req.body.lastName, email: req.body.email });
        e.save(function(err, doc){
            if(!err){
                res.redirect('/panel/employees');
            } else {
                res.end(err);    
            }    
        }); 
    }else{
        res.render('new', {title: 'New EMployee', error: true });
    }
});

app.get('/panel/employees/delete/:id', adminAuth, function(req, res){
    req.flash('message', 'You deleted an employee'); //Save the flash message in this page
    Employees.remove({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.redirect('/panel/employees');
        } else {
            res.end(err);    
        }    
    });
});

app.get('/panel/employees/edit/:id', adminAuth, function(req, res){
    req.flash('message', 'you modified an employee!'); // Save the flash message in this page
    Employees.findOne({ _id: req.params.id }, function(err, doc){
        if(!err){
            res.render('edit', { title: 'Edit employee', employee: doc});
        } else {
            res.end(err);    
        }    
    });
});

app.post('/panel/employees/edit/:id', adminAuth, function(req, res){
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