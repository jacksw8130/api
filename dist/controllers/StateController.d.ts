export declare class StateController {
    static create(req: any, res: any, next: any): Promise<void>;
    static update(req: any, res: any, next: any): Promise<void>;
    static State(req: any, res: any, next: any): Promise<void>;
    static allState(req: any, res: any, next: any): Promise<void>;
    static allStateWithTicket(req: any, res: any, next: any): Promise<void>;
    static userAllState(req: any, res: any, next: any): Promise<void>;
    static stateTickets(req: any, res: any, next: any): Promise<void>;
    static allOwnerState(req: any, res: any, next: any): Promise<void>;
    static delete(req: any, res: any, next: any): Promise<void>;
}
