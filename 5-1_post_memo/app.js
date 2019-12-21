

/**
 * create memo and send to webserver
 * 
 * use Express
 * 
 * 1. exe webserver: node app.js
 * 2. open memo.html 
 */

 //Express basic modules

 var express = require('express');
 var http = require('http');
 var path = require('path');

 // middleware
 var bodyParser = require('body-parser');
 var static = require('serve-static');

 // error handler
 var expressErrorHandler = require('express-error-handler');

 var fs = require('fs')

 var app =express();

 app.set('port', process.env.PORT || 3000);

 app.use(bodyParser.urlencoded({extended : false}))
 app.use(bodyParser.json())

 app.use('/public', static(path.join(__dirname, 'public')));

 var router = express.Router();

 //save memo

 router.route('/process/save').post(function(req,res){
     console.log('called /process/save!');

     try {
         var paramAuthor = req.body.author;
         var paramContents = req.body.contents;
         var paramCreateDate = req.body.createDate;

         console.log('author :' +paramAuthor);
         console.log('contents:' +paramContents);
         console.log('date:' +paramCreateDate);

         res.writeHead(200,{'Content-Type':'text/html;charset=utf8'});
         res.write('<div><p> saved memo!</p></div>');
         res.write('<div><input type="button" value="write again" onclick="javascript:history.back()"></div>');
        res.end();

     }catch(err){
         console. dir (err.stack);

         res.writeHead(400, {'Content-Type':'text/html;charset=urf8'});
         res.write('<div><p> Error!!! </p></div>');
         res.end();
     }
 });

 app.use('/', router);

 //404 error 

 var errorHandler = expressErrorHandler({
     static: {
         '404': './public/404.html'
     }
 });

 app.use( expressErrorHandler.httpError(404) );
 app.use( errorHandler);


 var server = http.createServer(app).listen(app.get('port'), function(){
     console.log('start webserver -> %s, %s',server.address().address, server.address().port)
 })
