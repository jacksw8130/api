import Bid from "../models/Bid";
import Location from "../models/Location";
import Ticket from "../models/Ticket";
import TicketCandidate from "../models/TicketCandidate";
import User from "../models/User";
import WalletTransaction from "../models/WalletTransaction";
import { Utils } from "../utils/Utils";

export class LocationController {

    static async create(req, res, next){  

        try {

            let location:any = await new Location(req.body).save();
            res.json({
                message:'Location Save Successfully',
                data:location,
                status_code:200
            });

        } catch (e) {
            next(e)
        }
        
   
    }

    static async update(req, res, next) {
        const LocationId = req.location._id;
        try {
            const location = await Location.findOneAndUpdate({_id: LocationId}, req.body, {new: true, useFindAndModify: false});
            res.json({
                message:'Location Updated Successfully',
                data:location,
                status_code:200
            });
        } catch (e) {
            next(e);
        }

    }

    static async result(req, res, next) {
        const locationId = req.location._id;
        try {

            // update location winning_seats
            const location = await Location.findOneAndUpdate({_id: locationId}, {candidate_winner_id:req.body.candidate_winner_id}, {new: true, useFindAndModify: false});
            if(location){
                let candidate_winner_id = location['candidate_winner_id'];
                if(candidate_winner_id){

                    // All ticket of this location
                    let tickets = await TicketCandidate.find({location_id:location['_id']}, {__v: 0});

                    for (const ticket of tickets) {

                        // update yes/no result
                        if(ticket['candidate_id']==candidate_winner_id){
                            await TicketCandidate.findOneAndUpdate({_id: ticket['_id']}, {yes_result:true, no_result:false}, {new: true, useFindAndModify: false});
                        }else{
                            await TicketCandidate.findOneAndUpdate({_id: ticket['_id']}, {yes_result:false, no_result:true}, {new: true, useFindAndModify: false});
                        }   

                        // Bid/Transaction Update
                        const bids = await Bid.find({ticket_type:"ticket_candidates",ticket_id: ticket._id,result_declare_status:false,bid_status:"pending"});
                        for (const bid of bids) {
                            var user_data = await User.findOne({_id: bid['user_id']});
                            // update yes_seats
                            if(bid['yes_or_no']=="yes"){
                                if(ticket['yes_result']==true){
                                    let winning_amount = bid['bid_amount']+(bid['bid_amount']*bid['winning_percentage'])/100;
                                    let to_balance=user_data.wallet+winning_amount;
                                    // update bid
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:winning_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
                                    // create transaction
                                    const idata = {
                                        to: 'users',
                                        to_id: bid['user_id'],
                                        to_balance: to_balance,
                                        mode: "winning",
                                        coins: winning_amount,
                                        bid_id: bid['_id'],
                                        created_at: new Utils().indianTimeZone,
                                        updated_at: new Utils().indianTimeZone
                                    };
                                    let walletTransaction = await new WalletTransaction(idata).save();
                                    if(walletTransaction){
                                        var user_wallet = await User.findOneAndUpdate({_id: bid['user_id']}, { $inc: { wallet: winning_amount} }, {new: true, useFindAndModify: false});
                                    }
                                }else{
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:0,bid_status:"loss"}, {new: true, useFindAndModify: false});
                                }
                            }else{
                                if(ticket['no_result']==true){
                                    let winning_amount = bid['bid_amount']+(bid['bid_amount']*bid['winning_percentage'])/100;
                                    let to_balance=user_data.wallet+winning_amount;
                                    // update bid
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:winning_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
                                    // create transaction
                                    const idata = {
                                        to: 'users',
                                        to_id: bid['user_id'],
                                        to_balance: to_balance,
                                        mode: "winning",
                                        coins: winning_amount,
                                        bid_id: bid['_id'],
                                        created_at: new Utils().indianTimeZone,
                                        updated_at: new Utils().indianTimeZone
                                    };
                                    let walletTransaction = await new WalletTransaction(idata).save();
                                    if(walletTransaction){
                                        var user_wallet = await User.findOneAndUpdate({_id: bid['user_id']}, { $inc: { wallet: winning_amount} }, {new: true, useFindAndModify: false});
                                    }
                                }else{
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result_declare_status:true, winning_amount:0,bid_status:"loss"}, {new: true, useFindAndModify: false});
                                }
                            }   
                        }

                    }
                }
                
            }
            res.json({
                message:'Location Result Declared Successfully',
                data:location,
                status_code:200
            });
        } catch (e) {
            next(e);
        }
    }

    static async Location(req, res, next){
        const location = req.location;
        const data = {
            message : 'Success',
            data:location
        };
        res.json(data);
    }

    static async stateLocation(req, res, next){
        const location = req.location;
        const data = {
            message : 'Success',
            data:location
        };
        res.json(data);
    }

    static async allLocation(req, res, next){

        try {
            const location = await Location.find({status:true}, {__v: 0}).populate({path:"state_id"});
            const data = {
                message : 'Success',
                data:location
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async allOwnerLocation(req, res, next){

        try {
            const location = await Location.find();
            const data = {
                message : 'Success',
                data:location
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }


    static async delete(req, res, next) {
        const location = req.location;
        try {
            await location.remove();
            res.json({
                message:'Success ! Location Deleted Successfully',
                status_code: 200
            });
        } catch (e) {
            next(e);
        }
    }

} 