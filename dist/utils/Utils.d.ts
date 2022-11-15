import * as moment from 'moment-timezone';
export declare class Utils {
    MAX_TOKEN_TIME: number;
    indianTimeZone: moment.Moment;
    static indianTimeZone(): moment.Moment;
    static generateVerificationToken(size?: number): number;
    static encryptPassword(password: string): Promise<any>;
    static comparePassword(password: {
        plainPassword: string;
        encryptedPassword: string;
    }): Promise<any>;
}
