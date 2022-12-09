import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariables } from "../environments/env";
import Bid from "../models/Bid";
import BidButton from "../models/BidButton";
import User from "../models/User";
import WalletTransaction from "../models/WalletTransaction";
import { Utils } from "../utils/Utils";

export class UserController {

    static async login(req, res, next) {
        const password = req.query.password;
        const user = req.user;
        try {
            await Utils.comparePassword({
                plainPassword: password,
                encryptedPassword: user.password
            });
            const token = Jwt.sign({code: user.code, user_id: user._id},
                getEnvironmentVariables().jwt_secret, {expiresIn: '120d'});
            const data = {message:"Success", token: token, data: user};
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    
    static async passwordChange(req, res, next) {
        const user_id = req.user.user_id;
        const password = req.body.password;
        const old_password = req.body.old_password;

        const hash = await Utils.encryptPassword(password);
        var update = {...{password:hash}, updated_at: new Utils().indianTimeZone}; 

        try {
            await Utils.comparePassword({
                plainPassword: old_password,
                encryptedPassword: req.user_data.password
            });

            const user = await User.findOneAndUpdate({_id: user_id}, update, {new: true, useFindAndModify: false});
            res.json({
                message:'Password change Successfully',
                data:user,
                status_code:200
            });
        } catch (e) {
            next(e);
        }
 
    }


    static async passwordForgot(req, res, next) {
        const code = req.body.code;
        const password = req.body.password;

        const hash = await Utils.encryptPassword(password);
        var update = {...{password:hash}, updated_at: new Utils().indianTimeZone}; 

        try {
            const user = await User.findOneAndUpdate({code: code}, update, {new: true, useFindAndModify: false});
            res.json({
                message:'Password update Successfully',
                data:user,
                status_code:200
            });
        } catch (e) {
            next(e);
        }
 
    }

    static async userData(req, res, next){
        var userId= req.user.user_id;

        try {
            var users = await User.findById({_id:userId}, {__v: 0});
            let bids = await Bid.find({user_id:userId}); // , ticket_type:"tickets"
            var sum=0;
            for (const bid of bids) {
                sum+=bid['bid_amount'];
            }

            // var bidagg = await Bid.aggregate([
            //     { $match: { user_id:req.user.user_id } },
            //     { $group: { _id: null, total_bid: { $sum: "$bid_amount" } } },
            // ]);
            // console.log(bids);

            const data = {
                message : 'Success',
                data:users,
                exposure:sum,
                // bidagg:bidagg
            };
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async transaction(req, res, next){

        try {
            const user_transactions = await WalletTransaction.find({$or:[{from_id:req.user.user_id},{to_id:req.user.user_id}]}).sort({created_at: -1}).populate([
                {path:'from_id'},
                {path:'to_id'},
                {path:'ticket_id'}
            ]);
            let userTransactionWithBids=[];
            for (const user_transaction of user_transactions) {
                let myData:object = user_transaction.toObject();
                if(myData['mode']=="bidding"){
                    let bids=await Bid.find({ticket_id: myData['ticket_id']["_id"],user_id: req.user.user_id,result_declare_status:true});
                    myData['ticket_id']['bids']=bids;
                }
                userTransactionWithBids.push(myData);
            }
            const data = {
                message : 'Success! All Transactions',
                data:userTransactionWithBids
            };
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async allBid(req, res, next){
        var user;
        try {
            if(req.query.limit){
                var limit = Number(req.query.limit);
                user = await Bid.find({user_id:req.user.user_id, ticket_type:"tickets"}).sort({created_at: -1}).limit(limit).populate([
                    { path:'ticket_id', populate:{ path: "party_id", select: ['name']}}
                ]);
            }else{
                user = await Bid.find({user_id:req.user.user_id, ticket_type:"tickets"}).sort({created_at: -1}).populate([
                    { path:'ticket_id', populate:{ path: "party_id", select: ['name']}}
                ]);
            }
            const data = {
                message : 'Success! All Bids',
                data:user
            };
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async profile(req, res, next) {
        const userId = req.user.user_id;
        let passwordObject:any = {};
        if(req.body.password){
            const password = await Utils.encryptPassword(req.body.password);
            passwordObject.password=password;
        }

        try {
            var update = {...req.body, ...passwordObject, updated_at: new Utils().indianTimeZone}; 

            const user = await User.findOneAndUpdate({_id: userId}, update, {new: true, useFindAndModify: false});
            res.json({
                message:'user update Successfully',
                data:user,
                status_code:200
            });
        } catch (e) {
            next(e);
        }
 
    }

    static async update(req, res, next) {
        const userId = req.user._id;
        try {
            const user = await User.findOneAndUpdate({_id: userId}, req.body, {new: true, useFindAndModify: false});
            res.send(user);
        } catch (e) {
            next(e);
        }

    }

    static async deleteUser(req, res, next) {
        const user = req.user;
        try {
            await user.remove();
            res.json({
                message:'Success ! User Deleted Successfully',
                status_code: 200
            });
        } catch (e) {
            next(e);
        }
    }

    static async bid(req, res, next) {

        try {
            var user_data = await User.findOne({_id: req.user.user_id});

            if(req.body.yes_or_no=="no"){
                let bid_amount=req.body.bid_amount;
                if(user_data['wallet']>bid_amount){
                    const bdata = {
                        user_id: req.user.user_id,
                        ticket_id: req.body.ticket_id,
                        ticket_type: req.body.ticket_type,
                        ticket_data: req.body.ticket_data,
                        yes_or_no: req.body.yes_or_no,
                        seat: req.body.seat,
                        winning_percentage: req.body.winning_percentage,
                        bid_amount: bid_amount,
                        bid_status: "pending",
                        created_at: new Utils().indianTimeZone,
                        updated_at: new Utils().indianTimeZone
                    };
        
                    let bid = await new Bid(bdata).save();
                    if(bid){
                        // const from_balance=user_data.wallet-bid_amount;
                        // const idata = {
                        //     from: 'users',
                        //     from_id: req.user.user_id,
                        //     from_balance: from_balance,
                        //     mode: "bidding",
                        //     coins: bid_amount,
                        //     bid_id: bid['_id'],
                        //     created_at: new Utils().indianTimeZone,
                        //     updated_at: new Utils().indianTimeZone
                        // };
                        // let walletTransaction = await new WalletTransaction(idata).save();
                        var user_wallet = await User.findOneAndUpdate({_id: req.user.user_id}, { $inc: { wallet: -bid_amount} }, {new: true, useFindAndModify: false});
                        
                        
                        const data = {
                            message :'Successfully bid on party ticket!',
                            bid:bid,
                            user:user_wallet,
                            status_code:200
        
                        };
                        res.json(data);
                    }
                }else{
                    throw new Error('Low Balance');
                }
            }else{
                const bdata = {
                    user_id: req.user.user_id,
                    ticket_id: req.body.ticket_id,
                    ticket_type: req.body.ticket_type,
                    ticket_data: req.body.ticket_data,
                    yes_or_no: req.body.yes_or_no,
                    seat: req.body.seat,
                    winning_percentage: req.body.winning_percentage,
                    bid_amount: req.body.bid_amount,
                    bid_status: "pending",
                    created_at: new Utils().indianTimeZone,
                    updated_at: new Utils().indianTimeZone
                };
    
                let bid = await new Bid(bdata).save();
                if(bid){
                    // const from_balance=user_data.wallet-req.body.bid_amount;
                    // const idata = {
                    //     from: 'users',
                    //     from_id: req.user.user_id,
                    //     from_balance: from_balance,
                    //     mode: "bidding",
                    //     coins: req.body.bid_amount,
                    //     bid_id: bid['_id'],
                    //     created_at: new Utils().indianTimeZone,
                    //     updated_at: new Utils().indianTimeZone
                    // };
                    // let walletTransaction = await new WalletTransaction(idata).save();
                    var user_wallet = await User.findOneAndUpdate({_id: req.user.user_id}, { $inc: { wallet: -req.body.bid_amount} }, {new: true, useFindAndModify: false});
                    
                    
                    const data = {
                        message :'Successfully bid on party ticket!',
                        bid:bid,
                        user:user_wallet,
                        status_code:200
    
                    };
                    res.json(data);
                }
            }

            
        } catch (e) {
            next(e);
        }
    }

    static async bid_candidate(req, res, next) {

        try {
            var user_data = await User.findOne({_id: req.user.user_id});

            if(req.body.yes_or_no=="no"){
                let bid_amount=req.body.bid_amount;
                if(user_data['wallet']>bid_amount){
                    const bdata = {
                        user_id: req.user.user_id,
                        ticket_id: req.body.ticket_id,
                        ticket_type: req.body.ticket_type,
                        ticket_data: req.body.ticket_data,
                        yes_or_no: req.body.yes_or_no,
                        winning_percentage: req.body.winning_percentage,
                        bid_amount: bid_amount,
                        bid_status: "pending",
                        created_at: new Utils().indianTimeZone,
                        updated_at: new Utils().indianTimeZone
                    };
        
                    let bid = await new Bid(bdata).save();
                    if(bid){
                        // const from_balance=user_data.wallet-bid_amount;
                        // const idata = {
                        //     from: 'users',
                        //     from_id: req.user.user_id,
                        //     from_balance: from_balance,
                        //     mode: "bidding",
                        //     coins: req.body.bid_amount,
                        //     bid_id: bid['_id'],
                        //     created_at: new Utils().indianTimeZone,
                        //     updated_at: new Utils().indianTimeZone
                        // };
                        // let walletTransaction = await new WalletTransaction(idata).save();
                        var user_wallet = await User.findOneAndUpdate({_id: req.user.user_id}, { $inc: { wallet: -bid_amount} }, {new: true, useFindAndModify: false});
                        
                        
                        const data = {
                            message :'Successfully bid on candidate!',
                            bid:bid,
                            user:user_wallet,
                            status_code:200
        
                        };
                        res.json(data);
                    }
                }else{
                    throw new Error('Low Balance');
                }
            }else{
                const bdata = {
                    user_id: req.user.user_id,
                    ticket_id: req.body.ticket_id,
                    ticket_type: req.body.ticket_type,
                    ticket_data: req.body.ticket_data,
                    yes_or_no: req.body.yes_or_no,
                    winning_percentage: req.body.winning_percentage,
                    bid_amount: req.body.bid_amount,
                    bid_status: "pending",
                    created_at: new Utils().indianTimeZone,
                    updated_at: new Utils().indianTimeZone
                };
    
                let bid = await new Bid(bdata).save();
                if(bid){
                    // const from_balance=user_data.wallet-req.body.bid_amount;
                    // const idata = {
                    //     from: 'users',
                    //     from_id: req.user.user_id,
                    //     from_balance: from_balance,
                    //     mode: "bidding",
                    //     coins: req.body.bid_amount,
                    //     bid_id: bid['_id'],
                    //     created_at: new Utils().indianTimeZone,
                    //     updated_at: new Utils().indianTimeZone
                    // };
                    // let walletTransaction = await new WalletTransaction(idata).save();
                    var user_wallet = await User.findOneAndUpdate({_id: req.user.user_id}, { $inc: { wallet: -req.body.bid_amount} }, {new: true, useFindAndModify: false});
                    
                    
                    const data = {
                        message :'Successfully bid on candidate!',
                        bid:bid,
                        user:user_wallet,
                        status_code:200
    
                    };
                    res.json(data);
                }
            }

            
        } catch (e) {
            next(e);
        }
    }

    // Buttons

    static async buttons(req, res, next){
        try {
            let bidButton = await BidButton.find({user_id:req.user.user_id}).sort({ value: 1 });

            const data = {
                message : 'Success',
                data:bidButton,
            };
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async createButton(req, res, next){  

        try {

            let bidCount= await BidButton.countDocuments({user_id:req.user.user_id});
            if(bidCount>10){
                throw new Error('Sorry! Only 10 Buttons are aloowed');
            }else{
                let bidButton:any = await new BidButton({...req.body, user_id:req.user.user_id}).save();
                res.json({
                    message:'Bid Button Save Successfully',
                    data:bidButton,
                    status_code:200
                });
            }

            

        } catch (e) {
            next(e)
        }
        
   
    }

    static async updateButton(req, res, next) {
        const bidButtonId = req.bidButton._id;
        try {
            const bidButton = await BidButton.findOneAndUpdate({_id: bidButtonId}, req.body, {new: true, useFindAndModify: false});
            res.json({
                message:'Bid Button Updated Successfully',
                data:bidButton,
                status_code:200
            });
        } catch (e) {
            next(e);
        }

    }

    static async deleteButton(req, res, next) {
        const bidButton = req.bidButton;
        try {
            await bidButton.remove();
            res.json({
                message:'Success ! bidButton Deleted Successfully',
                status_code: 200
            });
        } catch (e) {
            next(e);
        }
    }


} 