import { Server } from "./server";

let server = new Server()
const app = server.app;

let port =  process.env.PORT || 2200;

export const myServer = app.listen(port, ()=>{
    console.log(`Election : PORT ${port}`);
    server.init();
});



