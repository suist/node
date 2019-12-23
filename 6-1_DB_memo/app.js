

/**
 * database function
 * 
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

 //=======mysql

 var mysql = require('mysql');

//======conection setting===

var pool = mysql.createPool({
    connectionLimit : 10,
    host : 'localhost',
    user :'root',
    password : 'admin',
    database :'test',
    debug : false
});



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


         insertMemo(paramAuthor, paramContents, paramCreateDate, function(err,addedMemo){
             if(err) {
                 console.error('error-saving memo! ' + err.stack);

                 res.writeHead('200', {'Content-Type': 'text/html;charset=utf8'});
                 res.write('<h2> occur error saving memo</h2>');
                 res.write('<p>' + err.stack + '</p>');
                 res.end();

                 return;

             }

             // send success msg if it has object

             if(addedMemo){
                 console.dir(addedMemo);
                 
                 console.log('inserted ' + addedMemo.affectedRows + 'rows');

                 var insertId = addedMemo.insertId;
                 console.log('insert id :' + insertId);

                 res.writeHead(200,{'Content-Type':'text/html;charset=utf8'});
                res.write('<div><p> saved memo!</p></div>');
                res.write('<div><input type="button" value="write again" onclick="javascript:history.back()"></div>');
                res.end();

             } else {

                res.writeHead(200,{'Content-Type':'text/html;charset=utf8'});
                res.write('<div><p>fail to saved memo!</p></div>');
                  res.end();


             }
         })

         

     }catch(err){
         console.dir(err.stack);

         res.writeHead(400, {'Content-Type':'text/html;charset=urf8'});
         res.write('<div><p> Error!!! </p></div>');
         res.end();
     }
 });

 app.use('/', router);

//insert memo function

var insertMemo = function(author, contents, createDate, callback){
    console.log('called insertMemo:' + author + ', ' + contents + ', ' +createDate);

    //get connection from pool

    pool.getConnection(function(err, conn){
        if(err){
            if(conn){
                conn.release(); //must! release

            }

            callback(err, null);
            return;
        }
        console.log('conn threadId :' + conn.threadId);

        
        var data = {author:author, contents:contents, createDate:createDate};

        //SQL
        var exec = conn.query('inser into memo set ? ', data, function(err,result){
            conn.release();
            console.log(' exe SQL:' + exec.sql);

            if(err){
                console.log('error- execute SQL')
                console.dir(err);

                callback(err,null);

                return;
            }

            callback (null, result);
        });

        conn.on('error',function(err){
            console.log('occur error! connecting Database');
            console.dir(err);

            callback(err,null);
        });

    });
}






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
