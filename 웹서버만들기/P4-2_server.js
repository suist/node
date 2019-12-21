
// socket client -> send data ->  server 
// socket client <- send data <- server


var net = require('net');

//create server

var server = net.createServer( function (socket){
    //check client information

    socket.name = socket.remoteAddress + ":" + socket.remotePort;
    console.log('connected client->' + socket.name);

    //event when it get a message from client
    socket.on('data', function(data){
        console.log('data from client ' + data);

        socket.write(data + 'from server.');
    });

    //In case of disconnection from client
    socket.on('end', function(){
        console.log('disconnected from client' + socket.name);
    });

});

// execute socket server
var port =3000;
server.listen(port);

console.log('executed socket server :' + port);




