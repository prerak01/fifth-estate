import { type ContractAddress } from '@midnight-ntwrk/compact-runtime';
import { type Logger } from 'pino';
import { type BallotDerivedState, type BallotProviders, type DeployedBallotContract } from './common-types.js';
import { type Observable } from 'rxjs';
/**
 * An API for a deployed ballot.
 */
export interface DeployedBallotAPI {
    readonly deployedContractAddress: ContractAddress;
    readonly state$: Observable<BallotDerivedState>;
    openPoll: (question: string) => Promise<void>;
    voteYes: () => Promise<void>;
    voteNo: () => Promise<void>;
    closePoll: () => Promise<void>;
}
/**
 * Provides an implementation of {@link DeployedBallotAPI} by adapting a deployed ballot
 * contract.
 *
 * @remarks
 * The `BallotPrivateState` is managed at the DApp level by a private state provider. As such, this
 * private state is shared between all instances of {@link BallotAPI}, and their underlying deployed
 * contracts. The private state defines a `'secretKey'` property that effectively identifies the current
 * user, and is used to determine if the current user is the owner of the poll as the observable
 * contract state changes.
 *
 * TODO: Update BallotAPI to use contract level private state storage.
 */
export declare class BallotAPI implements DeployedBallotAPI {
    readonly deployedContract: DeployedBallotContract;
    private readonly logger?;
    /** @internal */
    private constructor();
    /**
     * Gets the address of the current deployed contract.
     */
    readonly deployedContractAddress: ContractAddress;
    /**
     * Gets an observable stream of state changes based on the current public (ledger),
     * and private state data.
     */
    readonly state$: Observable<BallotDerivedState>;
    /**
     * Opens a new poll with a given question.
     */
    openPoll(question: string): Promise<void>;
    /**
     * Votes "Yes" on the ballot.
     */
    voteYes(): Promise<void>;
    /**
     * Votes "No" on the ballot.
     */
    voteNo(): Promise<void>;
    /**
     * Closes the current poll.
     */
    closePoll(): Promise<void>;
    /**
     * Deploys a new ballot contract to the network.
     */
    static deploy(providers: BallotProviders, logger?: Logger): Promise<BallotAPI>;
    /**
     * Finds an already deployed ballot contract on the network, and joins it.
     */
    static join(providers: BallotProviders, contractAddress: ContractAddress, logger?: Logger): Promise<BallotAPI>;
    private static getPrivateState;
}
/**
 * A namespace that represents the exports from the `'utils'` sub-package.
 *
 * @public
 */
export * as utils from './utils/index.js';
export * from './common-types.js';
