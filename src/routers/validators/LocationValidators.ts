import { body, param, query } from "express-validator";
import Candidate from "../../models/Candidate";

import Location from "../../models/Location";
import State from "../../models/State";

export class LocationValidators{

    static create(){

        return  [   
                    body('state_id', 'state_id Is Required').custom((state_id, {req})=>{
                        return  State.findOne({_id:state_id}).then(state => {
                                    if(state){
                                        return true;
                                        
                                    }else{
                                        throw new Error('state not Exist');
                                    }
                                })
                    }),
                    body('name', 'name Is Required').custom((name, {req})=>{
                        return  Location.findOne({name:name,state_id:req.body.state_id}).then(location => {
                                    if(location){
                                        throw new Error('Location Already Exist');
                                    }else{
                                        return true;
                                    }
                                })
                    }),
    
                ];
        
    }

    static Location() {
        return [param('id').custom((id, {req}) => {
            return Location.findOne({_id: id}, {__v: 0}).populate({path:"state_id"}).then((location) => {
                if (location) {
                    req.location = location;
                    return true;
                } else {
                    throw new Error('Location Does Not Exist');
                }
            })
        })]
    }

    static stateLocation() {
        return [param('id').custom((id, {req}) => {
            return Location.find({state_id: id}, {__v: 0}).populate([{path:"state_id"},{path:"candidate_winner_id"}]).then((location) => {
                if (location) {
                    req.location = location;
                    return true;
                } else {
                    throw new Error('Location Does Not Exist');
                }
            })
        })]
    }

    static update() {
        return [param('id').custom((id, {req}) => {
            return Location.findOne({_id: id}, {__v: 0}).then((location) => {
                if (location) {
                    req.location = location;
                    return true;
                } else {
                    throw new Error('Location Does Not Exist');
                }
            })
        })]
    }

    static result() {
        return [
            body('candidate_winner_id', 'candidate_winner_id Is Required').custom((candidate_winner_id, {req}) => {
                return Candidate.findOne({_id: candidate_winner_id}, {__v: 0}).then((candidate) => {
                    if (candidate) {
                        req.candidate = candidate;
                        return true;
                    } else {
                        throw new Error('Candidate Does Not Exist');
                    }
                })
            }),
            param('id').custom((id, {req}) => {
                return Location.findOne({_id: id}, {__v: 0}).then((location) => {
                    if (location) {
                        req.location = location;
                        return true;
                    } else {
                        throw new Error('Location Does Not Exist');
                    }
                })
            })
            
        ]
    }

    static delete() {
        return [param('id').custom((id, {req}) => {
            return Location.findOne({_id: id}, {__v: 0}).then((location) => {
                if (location) {
                    req.location = location;
                    return true; 
                } else {
                    throw new Error('Location Does Not Exist');
                }
            })
        })]
    }


}