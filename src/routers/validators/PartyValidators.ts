import { body, param, query } from "express-validator";

import Party from "../../models/Party";

export class PartyValidators{

    static create(){

        return  [   
                    body('state_id', 'state_id Is Required'),
                    body('name', 'name Is Required').custom((name, {req})=>{
                        return  Party.findOne({name:name,state_id:req.body.state_id}).then(party => {
                                    if(party){
                                        throw new Error('Party Already Exist');
                                    }else{
                                        return true;
                                    }
                                })
                    })
    
                ];
        
    }

    static Party() {
        return [param('id').custom((id, {req}) => {
            return Party.findOne({_id: id}, {__v: 0}).populate({path:"state_id"}).then((party) => {
                if (party) {
                    req.party = party;
                    return true;
                } else {
                    throw new Error('Party Does Not Exist');
                }
            })
        })]
    }

    static stateParty() {
        return [param('id').custom((id, {req}) => {
            return Party.find({state_id: id, status:true}, {__v: 0}).populate([{path:"state_id"}]).then((party) => {
                if (party) {
                    req.party = party;
                    return true;
                } else {
                    throw new Error('Party Does Not Exist');
                }
            })
        })]
    }

    static update() {
        return [param('id').custom((id, {req}) => {
            return Party.findOne({_id: id}, {__v: 0}).then((party) => {
                if (party) {
                    req.party = party;
                    return true;
                } else {
                    throw new Error('Party Does Not Exist');
                }
            })
        })]
    }

    static result() {
        return [
            body('winning_seats', 'winning_seats Is Required').isNumeric(),
            param('id').custom((id, {req}) => {
                return Party.findOne({_id: id}, {__v: 0}).then((party) => {
                    if (party) {
                        if(party['result_declare_status']==false){
                            req.party = party;
                            return true;
                        }else{
                            throw new Error('Party Result Already Declared');
                        }
                        
                    } else {
                        throw new Error('Party Does Not Exist');
                    }
                })
            })
            
        ]
    }

    static delete() {
        return [param('id').custom((id, {req}) => {
            return Party.findOne({_id: id}, {__v: 0}).then((party) => {
                if (party) {
                    req.party = party;
                    return true;
                } else {
                    throw new Error('Party Does Not Exist');
                }
            })
        })]
    }


}