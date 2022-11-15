import Bid from "../models/Bid";
import Party from "../models/Party";
import Ticket from "../models/Ticket";
import User from "../models/User";
import WalletTransaction from "../models/WalletTransaction";
import { Utils } from "../utils/Utils";

export class PartyController {

    static async create(req, res, next){  

        try {

            let party:any = await new Party(req.body).save();
            res.json({
                message:'Party Save Successfully',
                data:party,
                status_code:200
            });

        } catch (e) {
            next(e)
        }
        
   
    }

    static async update(req, res, next) {
        const PartyId = req.party._id;
        try {
            const party = await Party.findOneAndUpdate({_id: PartyId}, req.body, {new: true, useFindAndModify: false});
            res.json({
                message:'Party Updated Successfully',
                data:party,
                status_code:200
            });
        } catch (e) {
            next(e);
        }

    }

    static async result(req, res, next) {
        const partyId = req.party._id;
        try {

            // update party winning_seats
            const party = await Party.findOneAndUpdate({_id: partyId}, {winning_seats:req.body.winning_seats, result_declare_status:true}, {new: true, useFindAndModify: false});
            if(party){
                let party_winning_seats = party['winning_seats'];
                if(party_winning_seats){

                    // All ticket of this party
                    let tickets = await Ticket.find({party_id:party['_id']}, {__v: 0});

                    for (const ticket of tickets) {

                        await Ticket.findOneAndUpdate({_id: ticket['_id']}, {result_declare_status:true,expire:true}, {new: true, useFindAndModify: false});

                        const bids = await Bid.find({ticket_type:"tickets",ticket_id: ticket['_id'],result_declare_status:false,bid_status:"pending"});
                        for (const bid of bids) {
                            var user_data = await User.findOne({_id: bid['user_id']});
                            // update yes_seats
                            if(bid['yes_or_no']=="yes"){
                                if(party_winning_seats>=bid['seat']){
                                    let winning_amount =bid['bid_amount']+(bid['bid_amount']*bid['winning_percentage'])/100;
                                    let to_balance=user_data.wallet+winning_amount;
                                    // update bid
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result:true, result_declare_status:true, winning_amount:winning_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
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
                                         await User.findOneAndUpdate({_id: bid['user_id']}, { $inc: { wallet: winning_amount} }, {new: true, useFindAndModify: false});
                                    }
                                }else{
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result:false, result_declare_status:true, winning_amount:0,bid_status:"loss"}, {new: true, useFindAndModify: false});
                                }
                            }else{
                                if(party_winning_seats<=bid['seat']){
                                    let winning_amount = bid['bid_amount']+(bid['bid_amount']*bid['winning_percentage'])/100;
                                    let to_balance=user_data.wallet+winning_amount;
                                    // update bid
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result:true,result_declare_status:true, winning_amount:winning_amount,bid_status:"win"}, {new: true, useFindAndModify: false});
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
                                        await User.findOneAndUpdate({_id: bid['user_id']}, { $inc: { wallet: winning_amount} }, {new: true, useFindAndModify: false});
                                    }
                                }else{
                                    await Bid.findOneAndUpdate({_id: bid['_id']}, {result:true,result_declare_status:true, winning_amount:0,bid_status:"loss"}, {new: true, useFindAndModify: false});
                                }
                            }   
                        }

                    }
                }
                
            }
            res.json({
                message:'Party Result Declared Successfully',
                data:party,
                status_code:200
            });
        } catch (e) {
            next(e);
        }
    }

    static async Party(req, res, next){
        const party = req.party;
        const data = {
            message : 'Success',
            data:party
        };
        res.json(data);
    }

    static async stateParty(req, res, next){
        const party = req.party;
        const data = {
            message : 'Success',
            data:party
        };
        res.json(data);
    }

    static async allParty(req, res, next){

        try {
            const party = await Party.find({status:true}, {__v: 0}).populate({path:"state_id"});
            const data = {
                message : 'Success',
                data:party
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async allOwnerParty(req, res, next){

        try {
            const party = await Party.find();
            const data = {
                message : 'Success',
                data:party
            }; 
            res.json(data);
        } catch (e) {
            next(e)
        }
    }


    static async delete(req, res, next) {
        const party = req.party;
        try {
            await party.remove();
            res.json({
                message:'Success ! Party Deleted Successfully',
                status_code: 200
            });
        } catch (e) {
            next(e);
        }
    }

} 