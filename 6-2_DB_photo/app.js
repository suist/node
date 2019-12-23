


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

 var mysql = require('mysql');

 var pool = mysql.createPool({
     connectionsLimit :10,
     host : 'localhost',
     user : 'root',
     password : 'sunny',
     debug : false
 });




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





        // insertMemo 함수 호출하여 메모 추가
        insertMemo(paramAuthor, paramContents, paramCreateDate, filename, function(err, addedMemo) {
            // 에러 발생 시 - 클라이언트로 에러 전송
            if (err) {
                console.error('메모 저장 중 에러 발생 : ' + err.stack);

                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>메모 저장 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
                res.end();

                return;
            }

            // 결과 객체 있으면 성공 응답 전송
            if (addedMemo) {
                console.dir(addedMemo);

                console.log('inserted ' + addedMemo.affectedRows + 'rows');

                var insertId = addedMemo.insertId;
                console.log('추가한 레코드의 아이디 : ' + insertId);

                res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
                res.write('<div><p>메모가 저장되었습니다.</p></div>');
                res.write('<img src="/uploads/' + filename + '" width="200px">');
                res.write('<div><input type="button" value="다시 작성" onclick="javascript:history.back()"></div>');
                res.end();
            } else {
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
                res.write('<h2>메모 저장 실패</h2>');
                res.end();
            }
        });
         
     }catch(err){
         console.dir(err.stack);

         res.writeHead(400, {'Content-Type':'text/html;charset=urf8'});
         res.write('<div><p> Error!!! </p></div>');
         res.end();
     }
 });

 app.use('/', router);


//add memo function

var insertMemo = function(author, contents, createDate, filename, callback) {
    console.log('called insertMemo :' +author + ' , ' + contents+', '+ createDate +', '+ filename);

    //get connection pool
    pool.getConnection(function(err,conn){
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            
            callback(err, null);
            return;
        }   
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
    

        // 데이터를 객체로 만듦
        var data = {author:author, contents:contents, createDate:createDate, filename:filename};
    
        // SQL 문을 실행함
        var exec = conn.query('insert into memo set ?', data, function(err, result) {
            conn.release();  // 반드시 해제해야 함
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if (err) {
                console.log('SQL 실행 시 에러 발생함.');
                console.dir(err);
                
                callback(err, null);
                
                return;
            }
            
            callback(null, result);
            
        });
        
        conn.on('error', function(err) {      
                console.log('데이터베이스 연결 시 에러 발생함.');
                console.dir(err);
                
                callback(err, null);
        });

    })
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
 });
