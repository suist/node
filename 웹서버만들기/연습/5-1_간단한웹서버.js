var http = require('http');

//객체 생성
var server = http.createServer();

//웹서버 시작 3000번 포트에 대기

var port =3000;
server.listen(port, function(){
    console.log('웹 서버가 시작됨 : %d',port);
});

var host = '192.168.0.5';
var port = 3000;
server.listen(port,host,)