/**
 * A simple example of using net to allow connections.
 * See the README for more information.
 */
var net = require('net');

var users = [];

var server = net.createServer( function (socket) {
        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        users.push(socket);

        socket.write('Welcome To The Server\r\n');
        socket.write('Hello ' + socket.name);

        socket.on('data', function (data) {
            var text = data.toString('utf8');
            console.log(text);
            users.forEach( function(user, index) {
                if( user !== socket ) {
                    user.write(text);
                }
            }, this);
        });

        socket.on('end', function () {
            console.log("Socket: Got FIN Packet (close)");
        });

        socket.on('close', function () {
            console.log("Socket: Closed");
            // Could be more fancy, but going for readability.
            var foundIndex = -1;
            users.forEach( function(user, index) {
                if( user === socket ) {
                    foundIndex = index;
                }
            }, this);
            if( foundIndex !== -1 ) {
                users.splice(foundIndex, 1);
                console.log("Server: Removed user " + socket.name);
            } else {
                console.log("ERROR: Failed to remove user from set.");
            }
        });

        socket.on('error', function (error) {
            console.log("Socket: Error");
            console.error(error);
        });

        socket.on('timeout', function () {
            console.log("Socket: Timeout");
        });

    }
);

/**
 * Event: emitted after calling server.listen once the port is bound.
 */
server.on("listening", function () {
    console.log("SERVER: Listening");
});

/**
 * Event: Emitted when a new connection is made.
 */
server.on("connection", function (socket) {
    console.log("SERVER: New Connection");
});

/**
 * Event: Server closed, won't be emitted until all connections are ended.
 */
server.on("close", function () {
    console.log("SERVER: Closed");
});

/**
 * Event: Emitted on server error.
 */
server.on("error", function (error) {
    console.log("SERVER: Error");
    console.error(error);
});

server.listen(1337, '127.0.0.1');
