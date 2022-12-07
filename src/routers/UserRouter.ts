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

        // button
        this.router.get('/bid_button/all', GlobalMiddleWare.authenticate, UserController.buttons);
    }
    postRoutes(){
        // session
        //this.router.post('/password/forgot', UserValidators.passwordForgot(), GlobalMiddleWare.checkError, UserController.passwordForgot);
        this.router.post('/password/change', GlobalMiddleWare.authenticate, UserValidators.passwordChange(), GlobalMiddleWare.checkError, UserController.passwordChange);
        this.router.post('/bid', GlobalMiddleWare.authenticate, UserValidators.bid(), GlobalMiddleWare.checkError, UserController.bid);
        this.router.post('/bid_candidate', GlobalMiddleWare.authenticate, UserValidators.bid_candidate(), GlobalMiddleWare.checkError, UserController.bid_candidate);

        // button
        this.router.post('/bid_button/create', UserValidators.createButton(), GlobalMiddleWare.checkError, GlobalMiddleWare.authenticate, UserController.createButton);
    }
    patchRoutes(){
        this.router.patch('/update', GlobalMiddleWare.authenticate, UserController.profile);

        // button
        this.router.patch('/bid_button/update/:id', GlobalMiddleWare.authenticate, UserValidators.updateButton(), GlobalMiddleWare.checkError, UserController.updateButton);
    }

    deleteRoutes(){
        //this.router.delete('/delete/:id', GlobalMiddleWare.authenticate, UserValidators.deleteUser(), GlobalMiddleWare.checkError, UserController.deleteUser);
        // button
        this.router.delete('/bid_button/delete/:id', GlobalMiddleWare.authenticate, UserValidators.deleteButton(), GlobalMiddleWare.checkError, UserController.deleteButton);
    }
}

export default new UserRouter().router;