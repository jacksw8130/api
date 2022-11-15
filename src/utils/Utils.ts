import * as moment from 'moment-timezone';
import * as Bcrypt from 'bcrypt';
import * as multer from "multer";
import * as fs from 'fs';


export class Utils{

    // OTP VALIDATE TIME 
    public MAX_TOKEN_TIME=60000; // In MilliSeconds

    // INDIAN TIMEZONE FOR ALL SCHEMAS
    public indianTimeZone = moment.tz(Date.now(), "Asia/Kolkata").add(5, 'hours').add(30, 'minute');

    static indianTimeZone(){
        return moment.tz(Date.now(), "Asia/Kolkata").add(5, 'hours').add(30, 'minute');//.format('YYYY-MM-DD hh:mm:ss')
    }

    // GENERATE OTP
    static generateVerificationToken(size: number=4){
        let digits='0123456789';
        let otp='';
        for(let i=0;i<size;i++){
            otp+=digits[Math.floor(Math.random()*10)];
        }
        return parseInt(otp);
    }

    // Encrypt Password
    static encryptPassword(password: string): Promise<any> {
        return new Promise((resolve, reject) => {
            Bcrypt.hash(password, 10, (err, hash) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            })
        })
    }

    // Compare Password
    static async comparePassword(password: { plainPassword: string, encryptedPassword: string }): Promise<any> {
        return new Promise(((resolve, reject) => {
            Bcrypt.compare(password.plainPassword, password.encryptedPassword, ((err, isSame) => {
                if (err) {
                    reject(err);
                } else if (!isSame) {
                    reject(new Error('User Password Does not Match'));
                } else {
                    resolve(true);
                }
            }))
        }))
    }

}