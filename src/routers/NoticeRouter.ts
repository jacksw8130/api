import { Router } from "express";
import { NoticeController } from "../controllers/NoticeController";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { NoticeValidators } from "./validators/NoticeValidators";

class NoticeRouter {
    public router: Router;
    constructor(){
        this.router=Router();
        this.getRoutes();
        this.postRoutes();
        this.patchRoutes();
        this.deleteRoutes();

    }

    getRoutes(){
        this.router.get('/id/:id', NoticeValidators.Notice(), GlobalMiddleWare.checkError, NoticeController.Notice);
        this.router.get('/all', NoticeController.allNotice);
        this.router.get('/super_admin/all', GlobalMiddleWare.superadminAuthenticate, NoticeController.allSuperAdminNotice);
    }
    postRoutes(){
        this.router.post('/create', GlobalMiddleWare.superadminAuthenticate, NoticeValidators.create(), GlobalMiddleWare.checkError, NoticeController.create);
    }
    patchRoutes(){
        this.router.patch('/update/:id', GlobalMiddleWare.superadminAuthenticate, NoticeValidators.update(), GlobalMiddleWare.checkError, NoticeController.update);
    }
    deleteRoutes(){
        this.router.delete('/delete/:id', GlobalMiddleWare.superadminAuthenticate, NoticeValidators.delete(), GlobalMiddleWare.checkError,NoticeController.delete)
    }
}

export default new NoticeRouter().router;