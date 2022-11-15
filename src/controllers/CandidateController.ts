import Candidate from "../models/Candidate";
import Ticket from "../models/Ticket";
import { Utils } from "../utils/Utils";

export class CandidateController {

    static async create(req, res, next){  

        try {

            let candidate:any = await new Candidate(req.body).save();
            res.json({
                message:'Candidate Save Successfully',
                data:candidate,
                status_code:200
            });

        } catch (e) {
            next(e)
        }
        
   
    }

    static async update(req, res, next) {
        const CandidateId = req.candidate._id;
        try {
            const candidate = await Candidate.findOneAndUpdate({_id: CandidateId}, req.body, {new: true, useFindAndModify: false});
            res.json({
                message:'Candidate Updated Successfully',
                data:candidate,
                status_code:200
            });
        } catch (e) {
            next(e);
        }

    }

    static async result(req, res, next) {
        const candidateId = req.candidate._id;
        try {

            // update candidate winning_seats
            const candidate = await Candidate.findOneAndUpdate({_id: candidateId}, {winning_seats:req.body.winning_seats}, {new: true, useFindAndModify: false});
            if(candidate){
                let candidate_winning_seats = candidate['winning_seats'];
                if(candidate_winning_seats){

                    // All ticket of this candidate
                    let tickets = await Ticket.find({candidate_id:candidate['_id']}, {__v: 0});

                    for (const ticket of tickets) {

                        // update yes_seats
                        if(candidate_winning_seats>=ticket['yes_seats']){
                            await Ticket.findOneAndUpdate({_id: ticket['_id']}, {yes_result:true}, {new: true, useFindAndModify: false});
                        }else{
                            await Ticket.findOneAndUpdate({_id: ticket['_id']}, {yes_result:false}, {new: true, useFindAndModify: false});
                        }   
                        
                        // update no_seats
                        if(candidate_winning_seats<=ticket['no_seats']){
                            await Ticket.findOneAndUpdate({_id: ticket['_id']}, {no_result:true}, {new: true, useFindAndModify: false});
                        }else{
                            await Ticket.findOneAndUpdate({_id: ticket['_id']}, {no_result:false}, {new: true, useFindAndModify: false});
                        }

                    }
                }
                
            }
            res.json({
                message:'Candidate Winning Seat Updated Successfully',
                data:candidate,
                status_code:200
            });
        } catch (e) {
            next(e);
        }
    }

    static async Candidate(req, res, next){
        const candidate = req.candidate;
        const data = {
            message : 'Success',
            data:candidate
        };
        res.json(data);
    }

    static async stateCandidate(req, res, next){
        const candidate = req.candidate;
        const data = {
            message : 'Success',
            data:candidate
        };
        res.json(data);
    }

    static async locationCandidate(req, res, next){
        const candidate = req.candidate;
        const data = {
            message : 'Success',
            data:candidate
        };
        res.json(data);
    }

    static async allCandidate(req, res, next){

        try {
            const candidate = await Candidate.find({status:true}, {__v: 0}).populate({path:"state_id"});
            const data = {
                message : 'Success',
                data:candidate
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async allOwnerCandidate(req, res, next){

        try {
            const candidate = await Candidate.find();
            const data = {
                message : 'Success',
                data:candidate
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }


    static async delete(req, res, next) {
        const candidate = req.candidate;
        try {
            await candidate.remove();
            res.json({
                message:'Success ! Candidate Deleted Successfully',
                status_code: 200
            });
        } catch (e) {
            next(e);
        }
    }

} 