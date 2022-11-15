import { body, param, query } from "express-validator";

import Candidate from "../../models/Candidate";
import Location from "../../models/Location";
import State from "../../models/State";

export class CandidateValidators{

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
                    body('location_id', 'location_id Is Required').custom((location_id, {req})=>{
                        return  Location.findOne({_id:location_id}).then(location => {
                                    if(location){
                                        return true;
                                        
                                    }else{
                                        throw new Error('location not Exist');
                                    }
                                })
                    }),
                    body('name', 'name Is Required').custom((name, {req})=>{
                        return  Candidate.findOne({name:name,location_id:req.body.location_id}).then(candidate => {
                                    if(candidate){
                                        throw new Error('Candidate Already Exist');
                                    }else{
                                        return true;
                                    }
                                })
                    }),
                    body('party_name', 'party_name Is Required').custom((party_name, {req})=>{
                        return  Candidate.findOne({party_name:party_name,location_id:req.body.location_id}).then(candidate => {
                                    if(candidate){
                                        throw new Error('Party Already Exist');
                                    }else{
                                        return true;
                                    }
                                })
                    }),
    
                ];
        
    }

    static Candidate() {
        return [param('id').custom((id, {req}) => {
            return Candidate.findOne({_id: id}, {__v: 0}).populate({path:"state_id"}).then((candidate) => {
                if (candidate) {
                    req.candidate = candidate;
                    return true;
                } else {
                    throw new Error('Candidate Does Not Exist');
                }
            })
        })]
    }

    static stateCandidate() {
        return [param('id').custom((id, {req}) => {
            return Candidate.find({state_id: id}, {__v: 0}).populate([{path:"state_id"}]).then((candidate) => {
                if (candidate) {
                    req.candidate = candidate;
                    return true;
                } else {
                    throw new Error('Candidate Does Not Exist');
                }
            })
        })]
    }

    static locationCandidate() {
        return [param('id').custom((id, {req}) => {
            return Candidate.find({location_id: id}, {__v: 0}).populate([{path:"location_id"}]).then((candidate) => {
                if (candidate) {
                    req.candidate = candidate;
                    return true;
                } else {
                    throw new Error('Candidate Does Not Exist');
                }
            })
        })]
    }

    static update() {
        return [param('id').custom((id, {req}) => {
            return Candidate.findOne({_id: id}, {__v: 0}).then((candidate) => {
                if (candidate) {
                    req.candidate = candidate;
                    return true;
                } else {
                    throw new Error('Candidate Does Not Exist');
                }
            })
        })]
    }

    static result() {
        return [
            body('winning_seats', 'winning_seats Is Required'),
            param('id').custom((id, {req}) => {
                return Candidate.findOne({_id: id}, {__v: 0}).then((candidate) => {
                    if (candidate) {
                        req.candidate = candidate;
                        return true;
                    } else {
                        throw new Error('Candidate Does Not Exist');
                    }
                })
            })
            
        ]
    }

    static delete() {
        return [param('id').custom((id, {req}) => {
            return Candidate.findOne({_id: id}, {__v: 0}).then((candidate) => {
                if (candidate) {
                    req.candidate = candidate;
                    return true;
                } else {
                    throw new Error('Candidate Does Not Exist');
                }
            })
        })]
    }


}