import { body, param } from "express-validator";

import Notice from "../../models/Notice";

export class NoticeValidators{

    static create(){

        return  [ 
                    body('title', 'title Is Required').custom((title, {req})=>{
                        return  Notice.findOne({title:title}).then(notice => {
                                    if(notice){
                                        throw new Error('Notice Already Exist');
                                    }else{
                                        return true;
                                    }
                                })
                    }),
                    body('message', 'message Is Required').isString()
    
                ];
        
    }

    static Notice() {
        return [param('id').custom((id, {req}) => {
            return Notice.findOne({_id: id}, {__v: 0}).then((notice) => {
                if (notice) {
                    req.notice = notice;
                    return true;
                } else {
                    throw new Error('Notice Does Not Exist');
                }
            })
        })]
    }

    static update() {
        return [param('id').custom((id, {req}) => {
            return Notice.findOne({_id: id}, {__v: 0}).then((notice) => {
                if (notice) {
                    req.notice = notice;
                    return true;
                } else {
                    throw new Error('Notice Does Not Exist');
                }
            })
        })]
    }

    static delete() {
        return [param('id').custom((id, {req}) => {
            return Notice.findOne({_id: id}, {__v: 0}).then((notice) => {
                if (notice) {
                    req.notice = notice;
                    return true;
                } else {
                    throw new Error('Notice Does Not Exist');
                }
            })
        })]
    }


}