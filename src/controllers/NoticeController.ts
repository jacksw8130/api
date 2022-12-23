import Notice from "../models/Notice";

export class NoticeController {

    static async create(req, res, next){  

        try {

            let notice:any = await new Notice(req.body).save();
            res.json({
                message:'Notice Save Successfully',
                data:notice,
                status_code:200
            });

        } catch (e) {
            next(e)
        }
        
   
    }

    static async update(req, res, next) {
        const NoticeId = req.notice._id;
        try {
            const notice = await Notice.findOneAndUpdate({_id: NoticeId}, req.body, {new: true, useFindAndModify: false});
            res.json({
                message:'Notice Updated Successfully',
                data:notice,
                status_code:200
            });
        } catch (e) {
            next(e);
        }

    }

    static async Notice(req, res, next){
        const notice = req.notice;
        const data = {
            message : 'Success',
            data:notice
        };
        res.json(data);
    }

    static async allNotice(req, res, next){

        try {
            const notice = await Notice.find({status:true}, {__v: 0});
            const data = {
                message : 'Success',
                data:notice
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async allSuperAdminNotice(req, res, next){

        try {
            const notice = await Notice.find();
            const data = {
                message : 'Success',
                data:notice
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async delete(req, res, next) {
        const notice = req.notice;
        try {
            await notice.remove();
            res.json({
                message:'Success ! Notice Deleted Successfully',
                status_code: 200
            });
        } catch (e) {
            next(e);
        }
    }

} 