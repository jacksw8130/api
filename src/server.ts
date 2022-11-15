import * as  express from 'express';
import * as mongoose from 'mongoose';
import * as cors from 'cors';
import { getEnvironmentVariables } from './environments/env';
import UserRouter from './routers/UserRouter';
import TicketRouter from './routers/TicketRouter';
import SuperadminRouter from './routers/SuperadminRouter';
import AdminRouter from './routers/AdminRouter';

// CRON JOBS
import { Jobs } from './jobs/Jobs';
import PartyRouter from './routers/PartyRouter';
import StateRouter from './routers/StateRouter';

// socket
import * as core from 'express-serve-static-core';
import { socketService } from './socket/socketService';
import { myServer } from '.';
import { SocketHandler } from './socket/socketHandler';
import CandidateRouter from './routers/CandidateRouter';
import TicketCandidateRouter from './routers/TicketCandidateRouter';
import LocationRouter from './routers/LocationRouter';

export class Server {
    //public app:express.Application = express();
    public app:core.Application = express();

    // after socket - init() else constructor()
    init(){
        // socket
        socketService.initSocket(myServer);
        SocketHandler.connectSocket();

        // other 
        this.setConfigurations();
        this.setRoutes();
        this.error404Handler();
        this.handleErrors();
    }

    setConfigurations(){
        this.connectMongodb();
        this.configureBodyParser();
        Jobs.runRequiredJobs();
    }

    connectMongodb(){
        const databaseUrl = getEnvironmentVariables().db_url;
        mongoose.connect(databaseUrl, {useNewUrlParser: true, useUnifiedTopology:true}).then(()=>{
            console.log('mongoDb Connected');
        });
    }

    configureBodyParser(){
        this.app.use(express.json({limit: '1000mb'}));
        this.app.use(express.urlencoded({limit: '1000mb', extended: true, parameterLimit: 1000000 }));
    }

    setRoutes(){
        this.app.use(cors());
        this.app.use('/api/src/uploads', express.static('src/uploads'));
        this.app.use('/api/super_admin', SuperadminRouter);
        this.app.use('/api/admin', AdminRouter);
        this.app.use('/api/user', UserRouter);
        this.app.use('/api/ticket', TicketRouter);
        this.app.use('/api/state', StateRouter);
        this.app.use('/api/party', PartyRouter);
        this.app.use('/api/location', LocationRouter);
        this.app.use('/api/candidate', CandidateRouter);
        this.app.use('/api/ticket_candidate', TicketCandidateRouter);
    }

    error404Handler(){
        this.app.use((req,res)=>{
            res.status(200).json({      // By Default 200 else 404
                message:'Not Found !'+ getEnvironmentVariables().jwt_secret,
                status_code:404
            });
        }) 
    }

    handleErrors(){
        this.app.use((error, req, res, next)=>{
            const errorStatus = req.errorStatus || 500;
            res.status(200).json({                  // By Default 200 else errorStatus
                message: error.message || 'Something Went Wrong. Please Try Again',
                status_code:errorStatus
            });
        })
    }

}