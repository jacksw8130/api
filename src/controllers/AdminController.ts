import * as Jwt from "jsonwebtoken";
import { getEnvironmentVariables } from "../environments/env";
import Admin from "../models/Admin";
import User from "../models/User";
import { Utils } from "../utils/Utils";
import WalletTransaction from "../models/WalletTransaction";
import Bid from "../models/Bid";

export class AdminController {

    static async login(req, res, next) {
        const password = req.query.password;
        const admin = req.admin;
        try {
            await Utils.comparePassword({
                plainPassword: password,
                encryptedPassword: admin.password
            });
            const token = Jwt.sign({code: admin.code, admin_id: admin._id},
                getEnvironmentVariables().jwt_secret, {expiresIn: '120d'});
            const data = {message:"Success", token: token, data: admin};
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    static async update(req, res, next) {
        const adminId = req.admin.admin_id;

        let passwordObject:any = {};
        if(req.body.password){
            const password = await Utils.encryptPassword(req.body.password);
            passwordObject.password=password;
        }

        var update = {...req.body, ...passwordObject, updated_at: new Date()}; 

        //res.send(req.body);
        try {
            const admin = await Admin.findOneAndUpdate({_id: adminId}, update, {new: true, useFindAndModify: false});
            res.json({
                message:'admin update Successfully',
                data:admin,
                status_code:200
            });
        } catch (e) {
            next(e);
        }

    }

    static async data(req, res, next){
        var adminId= req.admin.admin_id;

        try {
            var admin = await Admin.findById({_id:adminId}, {__v: 0});
            var userCount = await User.countDocuments({admin_id:adminId});
            let myData = admin.toObject();
            myData['total_user']=userCount;
             // total deposit
             const depositTransactions = await WalletTransaction.find({to_id:admin['_id'], mode:"transfer"});
             var dt=0;
             for (const depositTransaction of depositTransactions) {
                 dt+=depositTransaction['coins'];
             }
             myData['total_deposit']=dt;

             // total transfer
             const transferTransactions = await WalletTransaction.find({from_id:admin['_id'], mode:"transfer"});
             var tt=0;
             for (const transferTransaction of transferTransactions) {
                 tt+=transferTransaction['coins'];
             }
             myData['total_transfer']=tt;

            const data = {
                message : 'Success',
                admin:myData,
                userCount:userCount
            };

            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async allUser(req, res, next){
        try {
            const user = await User.find({admin_id:req.admin.admin_id});
            const data = {
                message : 'Success !',
                data:user
            };
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async sAllUser(req, res, next){
        try {
            const users = await User.find({admin_id:req.admin.admin_id}).populate({path:'admin_id'});
            var users_array=[];
            for (const user of users) {
                let myData = user.toObject();
                // Balance
                myData['balance']=myData['wallet'];

                // Exposure
                let bids = await Bid.find({user_id:user['_id'], result_declare_status:false});
                var sum=0;
                for (const bid of bids) {
                    sum+=bid['bid_amount'];
                }
                myData['exposure']=sum;

                // Profit/Loss
                let bids_complete = await Bid.find({user_id:user['_id'], result_declare_status:true});
                var pl=0;
                for (const bidc of bids_complete) {
                    let remain = bidc['winning_amount']-bidc['bid_amount'];
                    pl+=remain;
                }
                myData['pl']=pl;
                users_array.push(myData);  
            }
            const data = {
                message : 'Success !',
                data:users_array
            };
            res.status(200).json(data);
        } catch (e) {
            next(e)
        }
    }

    static async createUser(req, res, next){
        const name = req.body.name;
        const code = req.body.code;
        const password = req.body.password;

        const hash = await Utils.encryptPassword(password);

        // Generate Unique userCode Via user Counts
        // const user_count=await User.countDocuments()+1;
        // const user_code=Number(user_count+'00000000000').toString(36);
        // const code="u"+user_code;

        try {
            
            const insert = {
                admin_id:req.admin.admin_id,
                code: code,
                password: hash,
                name: name,
                created_at: new Utils().indianTimeZone,
                updated_at: new Utils().indianTimeZone
            };
            let user = await new User(insert).save();
            const data = {
                message :'Success',
                data:user
            };
            res.json(data);
        } catch (e) {
            next(e);
        }
        
    }

    static async checkUser(req, res, next){
        const code = req.body.code;
        const data = {
            message :'User Code Available',
            code:code
        };
        res.json(data);
        
    }

    static async updateUser(req, res, next) {
        const userId = req.user._id;

        let passwordObject:any = {};
        if(req.body.password){
            const password = await Utils.encryptPassword(req.body.password);
            passwordObject.password=password;
        }
        var update = {...req.body, ...passwordObject, updated_at: new Utils().indianTimeZone};

        try {
            const user = await User.findOneAndUpdate({_id: userId, admin_id:req.admin.admin_id}, update, {new: true, useFindAndModify: false});
            const data = {
                message :'Success',
                data:user
            };
            res.json(data);
        } catch (e) {
            next(e);
        }

    }

    static async transfer(req, res, next){
        const from = 'admins';
        const from_id = req.admin.admin_id;
        const to = 'users';
        const to_id = req.body.user_id;
        const mode = "transfer";
        const coins = req.body.coins;

        try {

            var user_data = await User.findOne({_id: req.body.user_id});
            var admin_data = await Admin.findOne({_id: req.admin.admin_id});
            const from_balance=Number(admin_data.wallet)-Number(coins);
            const to_balance=Number(user_data.wallet)+Number(coins);

            const idata = {
                from: from,
                from_id: from_id,
                from_balance: from_balance,
                to: to,
                to_id: to_id,
                to_balance: to_balance,
                mode: mode,
                coins: coins,
                created_at: new Utils().indianTimeZone,
                updated_at: new Utils().indianTimeZone
            };
            let walletTransaction = await new WalletTransaction(idata).save();
            if(walletTransaction){
                var user_wallet = await User.findOneAndUpdate({_id: to_id}, { $inc: { wallet: coins, balance: coins} }, {new: true, useFindAndModify: false});
                var admin_wallet = await Admin.findOneAndUpdate({_id: from_id}, { $inc: { wallet: -coins} }, {new: true, useFindAndModify: false});
            }
            const data = {
                message :'Success',
                transaction:walletTransaction,
                admin:admin_wallet,
                user:user_wallet,
                status_code:200

            };
            res.json(data);
        } catch (e) {
            next(e);
        }
        
    }

    static async withdraw(req, res, next){
        const to = 'admins';
        const to_id = req.admin.admin_id;
        const from = 'users';
        const from_id = req.body.user_id;
        const mode = "withdraw";
        const coins = req.body.coins;

        try {

            var user_data = await User.findOne({_id: req.body.user_id});
            var admin_data = await Admin.findOne({_id: req.admin.admin_id});
            const from_balance=Number(user_data.wallet)-Number(coins);
            const to_balance=Number(admin_data.wallet)+Number(coins);
            
            const idata = {
                from: from,
                from_id: from_id,
                from_balance: from_balance,
                to: to,
                to_id: to_id,
                to_balance: to_balance,
                mode: mode,
                coins: coins,
                created_at: new Utils().indianTimeZone,
                updated_at: new Utils().indianTimeZone
            };
            let walletTransaction = await new WalletTransaction(idata).save();
            if(walletTransaction){
                var user_wallet = await User.findOneAndUpdate({_id: from_id}, { $inc: { wallet: -coins} }, {new: true, useFindAndModify: false});
                var admin_wallet = await Admin.findOneAndUpdate({_id: to_id}, { $inc: { wallet: coins} }, {new: true, useFindAndModify: false});
            }
            const data = {
                message :'Success',
                transaction:walletTransaction,
                user:user_wallet,
                admin:admin_wallet,
                status_code:200

            };
            res.json(data);
        } catch (e) {
            next(e);
        }
        
    }

    static async allTransaction(req, res, next){
        try {
            const admin = await WalletTransaction.find({$or:[{from_id:req.admin.admin_id},{to_id:req.admin.admin_id}]}).sort({created_at: -1}).populate([
                {path:'from_id'},
                {path:'to_id'},
                {path:'bid_id'}
            ]);
            const data = {
                message : 'Success! All Transactions',
                data:admin
            };
            res.json(data);
        } catch (e) {
            next(e)
        }
    }

    static async userTransaction(req, res, next){
        try {
            const userTransaction = await WalletTransaction.find({$or:[{from_id:req.user._id},{to_id:req.user._id}]}).sort({created_at: -1}).populate([
                {path:'from_id'},
                {path:'to_id'},
                {path:'bid_id'},
            ]);
            const data = {
                message : 'Success! User All Transactions',
                data:userTransaction
            };
            res.json(data);
        } catch (e) {
            next(e)
        }
    }



} 