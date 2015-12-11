var Browser = require('zombie');
var assert  = require('assert');

Browser.localhost('localhost', 3200);

// create new browser instance
//var browser = Browser.create(); ---------NO FUNCIONA ESTA SENTENCIA
var browser = new Browser;

browser.visit('/admin', function(err){
    browser
        .fill('email', 'admin@admin.com')
        .fill('password', '123456')
        //.fill('password', 'incorrect')
        .pressButton('Sing In', function(err){
            console.log('Success Test: ', browser.document.location.pathname);
        });
});