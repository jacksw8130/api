export declare class GlobalMiddleWare {
    static checkError(req: any, res: any, next: any): void;
    static authenticate(req: any, res: any, next: any): Promise<void>;
    static loginAuthenticate(req: any, res: any, next: any): Promise<void>;
    static ownerAuthenticate(req: any, res: any, next: any): Promise<void>;
    static superadminAuthenticate(req: any, res: any, next: any): Promise<void>;
    static adminAuthenticate(req: any, res: any, next: any): Promise<void>;
}
