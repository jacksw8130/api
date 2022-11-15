import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { UserValidators } from "./validators/UserValidators";

class UserRouter {
    public router: Router;
    constructor(){
        this.router=Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes(); 
        this.deleteRoutes();
    } 

    getRoutes(){
        this.router.get('/login', UserValidators.login(), GlobalMiddleWare.checkError, UserController.login);
        this.router.get('/data', GlobalMiddleWare.authenticate, UserController.userData);
        this.router.get('/transaction', GlobalMiddleWare.authenticate, UserController.transaction);
        this.router.get('/all_bid', GlobalMiddleWare.authenticate, UserController.allBid);
    }
    postRoutes(){
        // session
        //this.router.post('/password/forgot', UserValidators.passwordForgot(), GlobalMiddleWare.checkError, UserController.passwordForgot);
        this.router.post('/password/change', GlobalMiddleWare.authenticate, UserValidators.passwordChange(), GlobalMiddleWare.checkError, UserController.passwordChange);
        this.router.post('/bid', GlobalMiddleWare.authenticate, UserValidators.bid(), GlobalMiddleWare.checkError, UserController.bid);
        this.router.post('/bid_candidate', GlobalMiddleWare.authenticate, UserValidators.bid_candidate(), GlobalMiddleWare.checkError, UserController.bid_candidate);
    }
    patchRoutes(){
        this.router.patch('/update', GlobalMiddleWare.authenticate, UserController.profile);
        //this.router.patch('/update/:id', GlobalMiddleWare.ownerAuthenticate, UserValidators.update(), GlobalMiddleWare.checkError, UserController.update);
    }

    deleteRoutes(){
        //this.router.delete('/delete/:id', GlobalMiddleWare.authenticate, UserValidators.deleteUser(), GlobalMiddleWare.checkError, UserController.deleteUser);
    }
}

export default new UserRouter().router;