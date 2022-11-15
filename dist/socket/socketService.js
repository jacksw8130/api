"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socketService = void 0;
class socketService {
    static initSocket(server) {
        socketService.io = require('socket.io')(server, {
            cors: {
                origin: '*'
            }
        });
        return socketService.io;
    }
}
exports.socketService = socketService;
