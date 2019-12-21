


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

 // middleware for uploading file
 var multer = require('multer');

 // support CORS when asked as ajax
 var cors = require('cors');

 //mime module
 var mime = require('mime');



 var app =express();

 app.set('port', process.env.PORT || 3000);

 app.use(bodyParser.urlencoded({extended : false}))
 app.use(bodyParser.json())

 app.use('/public', static(path.join(__dirname, 'public')));
 app.use('/uploads', static(path.join(__dirname, 'uploads')));

 app.use(cors());


// body-parser -> multer -> router

var storage = multer.diskStorage({
    destination: function (req,file,callback) {
        callback(null, 'uploads')
    },
    filename: function (req,file,callback){
        var extension = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extension);
        callback(null,basename + Date.now() +extension);
    }
})
var upload = multer({
    storage : storage,
    limits: {
        files :10,
        fileSize: 1024 *1024 *1024
    }
})

var router = express.Router();


 //for saving memo

 router.route('/process/save').post(upload.array('photo',1), function(req,res){
     console.log('called /process/save!');

     try {
         var paramAuthor = req.body.author;
         var paramContents = req.body.contents;
         var paramCreateDate = req.body.createDate;

         console.log('author :' +paramAuthor);
         console.log('contents:' +paramContents);
         console.log('date:' +paramCreateDate);

         var files = req.files;

         console.dir('#===========first file information=========#')
         console.dir(req.files[0]);
         console.dir('#======#')


         var originalname = '',
         filename = '',
         mimetype ='',
         size =0;

         if (Array.isArray(files)) {
             console.log("files length : %d", files.length);

             for (var index =0; index < files.length; index++){
                 originalname = files[index].originalname;
                 filename = files[index].filename;
                 mimetype = files[index].mimetype;
                 size =files[index].size;
             }

             console.log('file information:' + originalname +',' + filename +','+ mimetype +', '+size);
         }else {
             console.log('The file doesnt exist in array');
         }

         res.writeHead(200,{'Content-Type':'text/html;charset=utf8'});
         res.write('<div><p> saved memo!</p></div>');
         res.write('<img src="/uploads/'+filename + '" width="200px">')
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
