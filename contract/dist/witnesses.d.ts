import { Ledger } from "./managed/ballot/contract/index.cjs";
import { WitnessContext } from "@midnight-ntwrk/compact-runtime";
export type BallotPrivateState = {
    readonly secretKey: Uint8Array;
};
export declare const createBallotPrivateState: (secretKey: Uint8Array) => {
    secretKey: Uint8Array<ArrayBufferLike>;
};
export declare const witnesses: {
    localSecretKey: ({ privateState, }: WitnessContext<Ledger, BallotPrivateState>) => [BallotPrivateState, Uint8Array];
};
