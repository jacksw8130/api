export class socketService {
    public static io;

    static initSocket(server){
        socketService.io = require('socket.io')(server, {
            cors :{
                origin : '*'
            }
        });
        return socketService.io;
    }
}