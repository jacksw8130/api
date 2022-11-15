export declare class OwnerController {
    static signup(req: any, res: any, next: any): Promise<void>;
    static createSuperadmin(req: any, res: any, next: any): Promise<void>;
    static login(req: any, res: any, next: any): Promise<void>;
    static update(req: any, res: any, next: any): Promise<void>;
    static data(req: any, res: any, next: any): Promise<void>;
    static all(req: any, res: any, next: any): Promise<void>;
    static allSuperadmin(req: any, res: any, next: any): Promise<void>;
    static allOwner(req: any, res: any, next: any): Promise<void>;
    static allUser(req: any, res: any, next: any): Promise<void>;
    static updateSuperadmin(req: any, res: any, next: any): Promise<void>;
    static transfer(req: any, res: any, next: any): Promise<void>;
    static withdraw(req: any, res: any, next: any): Promise<void>;
    static allTransaction(req: any, res: any, next: any): Promise<void>;
    static myTransaction(req: any, res: any, next: any): Promise<void>;
}
