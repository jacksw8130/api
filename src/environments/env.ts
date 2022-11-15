import { DevEnvironment } from "./dev.env";
import { ProdEnvironment } from "./prod.env";

export interface Environment {
    db_url: string,
    Twofactor_key: string,
    jwt_secret: string,
    site_url: string
}

export function getEnvironmentVariables() {

    if(process.env.NODE_ENV==='production'){
        return ProdEnvironment;
    }
    return DevEnvironment;
    
}