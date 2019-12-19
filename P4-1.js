//function reading a line and print nam


var fs = require('fs');
var readline = require('readline');

//readline 
function processFile(filename) {
    var instream = fs.createReadStream(filename);
    var reader = readline.createInterface(instream, process.stdout);

    var count =0;

    //event after readline
    reader.on('line', function(line){
        console.log('read a line :' + line);
        count +=1;

        //split space
        var tokens =line.split(' ');

        if(tokens != undefined && tokens.length >0){
            console.log('#' +count + ' ->' +tokens[0]);
        }
    });

    //finish
    reader.on('close', function(line){
        console.log('finish reading all file!');
    });
}

//execute function

var filename = './contact.txt';
processFile(filename);