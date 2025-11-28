// This file is part of midnightntwrk/example-counter.
// © 2025 Midnight Foundation
// SPDX-License-Identifier: Apache-2.0
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
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
 * Ballot common types and abstractions.
 *
 * @module
 */

import { type MidnightProviders } from '@midnight-ntwrk/midnight-js-types';
import { type FoundContract } from '@midnight-ntwrk/midnight-js-contracts';
import type {
    PollState,
    BallotPrivateState,
    Contract,
    Witnesses,
} from '../../contract/src/index';

export const ballotPrivateStateKey = 'ballotPrivateState';
export type PrivateStateId = typeof ballotPrivateStateKey;

/**
 * The private states consumed throughout the application.
 *
 * @remarks
 * {@link PrivateStates} can be thought of as a type that describes a schema for all
 * private states for all contracts used in the application. Each key represents
 * the type of private state consumed by a particular type of contract.
 * The key is used by the deployed contract when interacting with a private state provider,
 * and the type (i.e., `typeof PrivateStates[K]`) represents the type of private state
 * expected to be returned.
 *
 * Since there is only one contract type for the ballot example, we only define a
 * single key/type in the schema.
 *
 * @public
 */
export type PrivateStates = {
    /**
     * Key used to provide the private state for {@link BallotContract} deployments.
     */
    readonly ballotPrivateState: BallotPrivateState;
};

/**
 * Represents a ballot contract and its private state.
 *
 * @public
 */
export type BallotContract = Contract<BallotPrivateState, Witnesses<BallotPrivateState>>;

/**
 * The keys of the circuits exported from {@link BallotContract}.
 *
 * @public
 */
export type BallotCircuitKeys = Exclude<keyof BallotContract['impureCircuits'], number | symbol>;

/**
 * The providers required by {@link BallotContract}.
 *
 * @public
 */
export type BallotProviders = MidnightProviders<BallotCircuitKeys, PrivateStateId, BallotPrivateState>;

/**
 * A {@link BallotContract} that has been deployed to the network.
 *
 * @public
 */
export type DeployedBallotContract = FoundContract<BallotContract>;

/**
 * A type that represents the derived combination of public (or ledger), and private state.
 */
export type BallotDerivedState = {
    readonly pollState: PollState;
    readonly sequence: bigint;
    readonly question: string | undefined;
    readonly yesCount: bigint;
    readonly noCount: bigint;

    /**
     * A readonly flag that determines if the current poll owner corresponds to the current user.
     *
     * @remarks
     * The `pollOwner` property of the public (or ledger) state is the public key of the poll owner, while
     * the `secretKey` property of {@link BallotPrivateState} is the secret key of the current user. If
     * `pollOwner` corresponds to the public key derived from `secretKey`, then `isOwner` is `true`.
     */
    readonly isOwner: boolean;
};

// TODO: for some reason I needed to include "@midnight-ntwrk/wallet-sdk-address-format": "1.0.0-rc.1", should we bump in to rc-2 ?
