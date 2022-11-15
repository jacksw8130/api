import * as core from 'express-serve-static-core';
export declare class Server {
    app: core.Application;
    init(): void;
    setConfigurations(): void;
    connectMongodb(): void;
    configureBodyParser(): void;
    setRoutes(): void;
    error404Handler(): void;
    handleErrors(): void;
}
