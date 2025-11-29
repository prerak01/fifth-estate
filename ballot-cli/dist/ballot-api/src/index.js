// This file is part of midnightntwrk/example-counter.
// Copyright (C) 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// You may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * Provides types and utilities for working with ballot contracts.
 *
 * @packageDocumentation
 */
import contractModule from '../../contract/src/managed/ballot/contract/index.cjs';
const { Contract, ledger, pureCircuits, PollState } = contractModule;
import { convert_bigint_to_Uint8Array } from '@midnight-ntwrk/compact-runtime';
import { ballotPrivateStateKey, } from './common-types.js';
import { createBallotPrivateState, witnesses } from '../../contract/src/index';
import * as utils from './utils/index.js';
import { deployContract, findDeployedContract } from '@midnight-ntwrk/midnight-js-contracts';
import { combineLatest, map, tap, from } from 'rxjs';
import { toHex } from '@midnight-ntwrk/midnight-js-utils';
/** @internal */
const ballotContractInstance = new Contract(witnesses);
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
export class BallotAPI {
    deployedContract;
    logger;
    /** @internal */
    constructor(deployedContract, providers, logger) {
        this.deployedContract = deployedContract;
        this.logger = logger;
        this.deployedContractAddress = deployedContract.deployTxData.public.contractAddress;
        this.state$ = combineLatest([
            providers.publicDataProvider.contractStateObservable(this.deployedContractAddress, { type: 'latest' }).pipe(map((contractState) => ledger(contractState.data)), tap((ledgerState) => logger?.trace({
                ledgerStateChanged: {
                    ledgerState: {
                        ...ledgerState,
                        pollState: ledgerState.pollState === PollState.OPEN ? 'open' :
                            ledgerState.pollState === PollState.CLOSED ? 'closed' :
                                'empty',
                        pollOwner: toHex(ledgerState.pollOwner),
                    },
                },
            }))),
            from(providers.privateStateProvider.get(ballotPrivateStateKey)),
        ], (ledgerState, privateState) => {
            const hashedSecretKey = pureCircuits.publicKey(privateState.secretKey, convert_bigint_to_Uint8Array(32, ledgerState.sequence));
            return {
                pollState: ledgerState.pollState,
                question: ledgerState.question.value,
                yesCount: ledgerState.yesCount,
                noCount: ledgerState.noCount,
                sequence: ledgerState.sequence,
                isOwner: toHex(ledgerState.pollOwner) === toHex(hashedSecretKey),
            };
        });
    }
    /**
     * Gets the address of the current deployed contract.
     */
    deployedContractAddress;
    /**
     * Gets an observable stream of state changes based on the current public (ledger),
     * and private state data.
     */
    state$;
    /**
     * Opens a new poll with a given question.
     */
    async openPoll(question) {
        this.logger?.info(`openPoll: ${question}`);
        const txData = await this.deployedContract.callTx.openPoll(question);
        this.logger?.trace({
            transactionAdded: {
                circuit: 'openPoll',
                txHash: txData.public.txHash,
                blockHeight: txData.public.blockHeight,
            },
        });
    }
    /**
     * Votes "Yes" on the ballot.
     */
    async voteYes() {
        this.logger?.info('voteYes');
        const txData = await this.deployedContract.callTx.voteYes();
        this.logger?.trace({
            transactionAdded: {
                circuit: 'voteYes',
                txHash: txData.public.txHash,
                blockHeight: txData.public.blockHeight,
            },
        });
    }
    /**
     * Votes "No" on the ballot.
     */
    async voteNo() {
        this.logger?.info('voteNo');
        const txData = await this.deployedContract.callTx.voteNo();
        this.logger?.trace({
            transactionAdded: {
                circuit: 'voteNo',
                txHash: txData.public.txHash,
                blockHeight: txData.public.blockHeight,
            },
        });
    }
    /**
     * Closes the current poll.
     */
    async closePoll() {
        this.logger?.info('closePoll');
        const txData = await this.deployedContract.callTx.closePoll();
        this.logger?.trace({
            transactionAdded: {
                circuit: 'closePoll',
                txHash: txData.public.txHash,
                blockHeight: txData.public.blockHeight,
            },
        });
    }
    /**
     * Deploys a new ballot contract to the network.
     */
    static async deploy(providers, logger) {
        logger?.info('deployContract');
        const deployedBallotContract = await deployContract(providers, {
            privateStateId: ballotPrivateStateKey,
            contract: ballotContractInstance,
            initialPrivateState: await BallotAPI.getPrivateState(providers),
        });
        logger?.trace({
            contractDeployed: {
                finalizedDeployTxData: deployedBallotContract.deployTxData.public,
            },
        });
        return new BallotAPI(deployedBallotContract, providers, logger);
    }
    /**
     * Finds an already deployed ballot contract on the network, and joins it.
     */
    static async join(providers, contractAddress, logger) {
        logger?.info({
            joinContract: {
                contractAddress,
            },
        });
        const deployedBallotContract = await findDeployedContract(providers, {
            contractAddress,
            contract: ballotContractInstance,
            privateStateId: ballotPrivateStateKey,
            initialPrivateState: await BallotAPI.getPrivateState(providers),
        });
        logger?.trace({
            contractJoined: {
                finalizedDeployTxData: deployedBallotContract.deployTxData.public,
            },
        });
        return new BallotAPI(deployedBallotContract, providers, logger);
    }
    static async getPrivateState(providers) {
        const existingPrivateState = await providers.privateStateProvider.get(ballotPrivateStateKey);
        return existingPrivateState ?? createBallotPrivateState(utils.randomBytes(32));
    }
}
/**
 * A namespace that represents the exports from the `'utils'` sub-package.
 *
 * @public
 */
export * as utils from './utils/index.js';
export * from './common-types.js';
//# sourceMappingURL=index.js.map