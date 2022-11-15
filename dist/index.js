"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.myServer = void 0;
const server_1 = require("./server");
let server = new server_1.Server();
const app = server.app;
let port = process.env.PORT || 2200;
exports.myServer = app.listen(port, () => {
    console.log(`Election : PORT ${port}`);
    server.init();
});
