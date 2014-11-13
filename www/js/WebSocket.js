/**
 * Created with IntelliJ IDEA.
 * User: Hell
 * Date: 12.11.2014
 * Time: 23:58
 * To change this template use File | Settings | File Templates.
 */
// Create our websocket object with the address to the websocket
define(["lib/socket.io"], function(socketio) {

    return {
        io: undefined,
        connect: function(listener) {
            console.log("Connecting...");

            var io = socketio();
            io.on('msg', function(msg) {
                listener.handle(msg);
            });
        }
    }
});