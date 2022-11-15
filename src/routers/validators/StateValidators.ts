import { body, param, query } from "express-validator";

import State from "../../models/State";

export class StateValidators{

    static create(){

        return  [ 
                    body('name', 'name Is Required').custom((name, {req})=>{
                        return  State.findOne({name:name}).then(state => {
                                    if(state){
                                        throw new Error('State Already Exist');
                                    }else{
                                        return true;
                                    }
                                })
                    })
    
                ];
        
    }

    static State() {
        return [param('id').custom((id, {req}) => {
            return State.findOne({_id: id}, {__v: 0}).then((state) => {
                if (state) {
                    req.state = state;
                    return true;
                } else {
                    throw new Error('State Does Not Exist');
                }
            })
        })]
    }

    static stateTickets() {
        return [param('stateId').custom((stateId, {req}) => {
            return State.findOne({_id: stateId, status:true, bid_status:true}, {__v: 0}).then((state) => {
                if (state) {
                    req.state = state;
                    return true;
                } else {
                    throw new Error('State Does Not Exist');
                }
            })
        })]
    }

    static update() {
        return [param('id').custom((id, {req}) => {
            return State.findOne({_id: id}, {__v: 0}).then((state) => {
                if (state) {
                    req.state = state;
                    return true;
                } else {
                    throw new Error('State Does Not Exist');
                }
            })
        })]
    }

    static delete() {
        return [param('id').custom((id, {req}) => {
            return State.findOne({_id: id}, {__v: 0}).then((state) => {
                if (state) {
                    req.state = state;
                    return true;
                } else {
                    throw new Error('State Does Not Exist');
                }
            })
        })]
    }


}