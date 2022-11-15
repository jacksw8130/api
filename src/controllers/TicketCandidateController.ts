import TicketCandidate from "../models/TicketCandidate";
import Bid from "../models/Bid";
import State from "../models/State";
import Candidate from "../models/Candidate";
import Location from "../models/Location";

export class TicketCandidateController {

    static async create(req, res, next){  

        try {
            if(Number(req.body.max_bid) > Number(req.body.min_bid)){
                let ticketCandidate:any = await new TicketCandidate(req.body).save();
                res.status(200).json({
                    message:'TicketCandidate Save Successfully',
                    data:ticketCandidate,
                    status_code:200
                });
            }else{
                res.status(400).json({
                    message:'max bid should be more than min bid',
                    status_code:400
                });
            }
            

        } catch (e) {
            next(e)
        }
        
   
    }

    static async update(req, res, next) {
        const TicketCandidateId = req.ticketCandidate._id;
        try {
            const ticketCandidate = await TicketCandidate.findOneAndUpdate({_id: TicketCandidateId}, req.body, {new: true, useFindAndModify: false});
            res.json({
                message:'TicketCandidate Update Successfully',
                data:ticketCandidate,
                status_code:200
            });
        } catch (e) {
            next(e);
        }

    }

    static async ticketCandidate(req, res, next){
        const ticketCandidate = req.ticketCandidate;
        var sum=0;
        if(ticketCandidate['bids']){
            for (let bid of ticketCandidate['bids']) {
                sum+=bid['bid_amount'];
            }
        }
        
        const data = {
            message : 'Success',
            data:ticketCandidate,
            bid_sum:sum
        };
        res.json(data);
    }

    static async stateTicket(req, res, next){
        try {
            const state = await State.findOne({_id:req.state._id}, {__v: 0});
            let myData:object = state.toObject();
            myData['tickets']=[];
            const candidates = await Candidate.find({state_id:myData['_id'], status:true}, {__v: 0});
            for (const candidate of candidates) {
                let tickets=await TicketCandidate.find({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1}).populate('candidate_id');
                myData['tickets'] = [...myData['tickets'], ...tickets];
            }
            const data = {
                message : 'Success',
                data:myData
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async locationTicket(req, res, next){
        try {
            const location = await Location.findOne({_id:req.location._id}, {__v: 0});
            let myData:object = location.toObject();
            myData['tickets']=[];
            const candidates = await Candidate.find({location_id:myData['_id'], status:true}, {__v: 0});
            for (const candidate of candidates) {
                let tickets=await TicketCandidate.find({candidate_id:candidate['_id'], status:true}, {__v: 0}).sort({created_at: -1}).populate('candidate_id');
                myData['tickets'] = [...myData['tickets'], ...tickets];
            }
            const data = {
                message : 'Success',
                data:myData
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async ticketCandidateBids(req, res, next){
        const bids = await Bid.find({ticket_id:req.ticketCandidate._id}, {__v: 0}).populate({path:"user_id"});
        const data = {
            message : 'Success',
            data:bids
        };
        res.json(data);
    }

    static async allTicketCandidate(req, res, next){

        try {
            const ticketCandidate = await TicketCandidate.find({status:true}, {__v: 0}).populate({path:"state_id"});
            const data = {
                message : 'Success',
                data:ticketCandidate
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async allOwnerTicketCandidate(req, res, next){

        try {
            const ticketCandidate = await TicketCandidate.find().populate({path:"party_id"});
            const data = {
                message : 'Success',
                data:ticketCandidate
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }


    static async delete(req, res, next) {
        const ticketCandidate = req.ticketCandidate;
        try {
            await ticketCandidate.remove();
            res.json({
                message:'Success ! TicketCandidate Deleted Successfully',
                status_code: 200
            });
        } catch (e) {
            next(e);
        }
    }

} 