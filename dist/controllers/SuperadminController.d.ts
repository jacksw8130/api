export declare class SuperadminController {
    static signup(req: any, res: any, next: any): Promise<void>;
    static createAdmin(req: any, res: any, next: any): Promise<void>;
    static checkAdmin(req: any, res: any, next: any): Promise<void>;
    static login(req: any, res: any, next: any): Promise<void>;
    static update(req: any, res: any, next: any): Promise<void>;
    static data(req: any, res: any, next: any): Promise<void>;
    static allAdmin(req: any, res: any, next: any): Promise<void>;
    static allUser(req: any, res: any, next: any): Promise<void>;
    static sAllUser(req: any, res: any, next: any): Promise<void>;
    static updateAdmin(req: any, res: any, next: any): Promise<void>;
    static updateUser(req: any, res: any, next: any): Promise<void>;
    static transfer(req: any, res: any, next: any): Promise<void>;
    static withdraw(req: any, res: any, next: any): Promise<void>;
    static myTransaction(req: any, res: any, next: any): Promise<void>;
    static userTransaction(req: any, res: any, next: any): Promise<void>;
    static adminTransaction(req: any, res: any, next: any): Promise<void>;
    static allTransaction(req: any, res: any, next: any): Promise<void>;
}
