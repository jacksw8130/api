export declare class CandidateValidators {
    static create(): import("express-validator").ValidationChain[];
    static Candidate(): import("express-validator").ValidationChain[];
    static stateCandidate(): import("express-validator").ValidationChain[];
    static locationCandidate(): import("express-validator").ValidationChain[];
    static update(): import("express-validator").ValidationChain[];
    static result(): import("express-validator").ValidationChain[];
    static delete(): import("express-validator").ValidationChain[];
}
