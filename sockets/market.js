var socketIO = require('socket.io');

module.exports.listen = function (server) {
    var io = socketIO(server);

    io.of('/dashboard')
        .on('connection', function(socket){
        console.log('a user connected');

        // socket.on('tester', function(msg){
        //     // io.emit('tester', msg);
        //     console.log("tester received");
        // });

        socket.on('disconnect', function(){
            console.log('user disconnected');
        });
    });

    return io;
};