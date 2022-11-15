export declare class OwnerValidators {
    static signup(): import("express-validator").ValidationChain[];
    static createSuperadmin(): import("express-validator").ValidationChain[];
    static login(): import("express-validator").ValidationChain[];
    static updateSuperadmin(): import("express-validator").ValidationChain[];
    static allOwner(): import("express-validator").ValidationChain[];
    static allUser(): import("express-validator").ValidationChain[];
    static transfer(): import("express-validator").ValidationChain[];
    static withdraw(): import("express-validator").ValidationChain[];
}
