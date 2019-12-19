// socket client -> send data ->  server 
// socket client <- send data <- server

var net =require('net');

var hostname ='localhost';
var port = 3000;

//connect server

var client = new net.Socket();
client.connect(port, hostname, function(){
    console.log('connected server ->' + hostname + ':' + port);
    client.write('Hello');
});

// event when it get data from server
client.on('data',function(data){
    console.log('data from server->' + data );

    //exit client

    client.destroy();
    
});

client.on('close', function(){
    console.log('disconnected!');
})