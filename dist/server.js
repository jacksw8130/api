"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Server = void 0;
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const env_1 = require("./environments/env");
const UserRouter_1 = require("./routers/UserRouter");
const TicketRouter_1 = require("./routers/TicketRouter");
const SuperadminRouter_1 = require("./routers/SuperadminRouter");
const AdminRouter_1 = require("./routers/AdminRouter");
// CRON JOBS
const Jobs_1 = require("./jobs/Jobs");
const PartyRouter_1 = require("./routers/PartyRouter");
const StateRouter_1 = require("./routers/StateRouter");
const socketService_1 = require("./socket/socketService");
const _1 = require(".");
const socketHandler_1 = require("./socket/socketHandler");
const CandidateRouter_1 = require("./routers/CandidateRouter");
const TicketCandidateRouter_1 = require("./routers/TicketCandidateRouter");
const LocationRouter_1 = require("./routers/LocationRouter");
class Server {
    constructor() {
        //public app:express.Application = express();
        this.app = express();
    }
    // after socket - init() else constructor()
    init() {
        // socket
        socketService_1.socketService.initSocket(_1.myServer);
        socketHandler_1.SocketHandler.connectSocket();
        // other 
        this.setConfigurations();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();
    }
    setConfigurations() {
        this.connectMongodb();
        this.configureBodyParser();
        Jobs_1.Jobs.runRequiredJobs();
    }
    connectMongodb() {
        const databaseUrl = (0, env_1.getEnvironmentVariables)().db_url;
        mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
            console.log('mongoDb Connected');
        });
    }
    configureBodyParser() {
        this.app.use(express.json({ limit: '1000mb' }));
        this.app.use(express.urlencoded({ limit: '1000mb', extended: true, parameterLimit: 1000000 }));
    }
    setRoutes() {
        this.app.use(cors());
        this.app.use('/api/src/uploads', express.static('src/uploads'));
        this.app.use('/api/super_admin', SuperadminRouter_1.default);
        this.app.use('/api/admin', AdminRouter_1.default);
        this.app.use('/api/user', UserRouter_1.default);
        this.app.use('/api/ticket', TicketRouter_1.default);
        this.app.use('/api/state', StateRouter_1.default);
        this.app.use('/api/party', PartyRouter_1.default);
        this.app.use('/api/location', LocationRouter_1.default);
        this.app.use('/api/candidate', CandidateRouter_1.default);
        this.app.use('/api/ticket_candidate', TicketCandidateRouter_1.default);
    }
    error404Handler() {
        this.app.use((req, res) => {
            res.status(200).json({
                message: 'Not Found !' + (0, env_1.getEnvironmentVariables)().jwt_secret,
                status_code: 404
            });
        });
    }
    handleErrors() {
        this.app.use((error, req, res, next) => {
            const errorStatus = req.errorStatus || 500;
            res.status(200).json({
                message: error.message || 'Something Went Wrong. Please Try Again',
                status_code: errorStatus
            });
        });
    }
}
exports.Server = Server;
